/**
 * FIX PENDING PAYMENTS - Remote Script
 * =====================================
 * This script runs locally and:
 * 1. Uses Razorpay API to check each pending registration's actual payment status
 * 2. Calls the live backend admin endpoint to fix confirmed payments
 * 
 * No database connection needed - works entirely via APIs!
 * 
 * Usage:
 *   DRY RUN:  node scripts/fix_pending_payments_remote.js --dry-run
 *   LIVE FIX: node scripts/fix_pending_payments_remote.js
 */

const Razorpay = require('razorpay');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const BACKEND_URL = 'https://yashotechfest2k26-production.up.railway.app';
const ADMIN_SECRET = 'YASHO_ADMIN_2026';
const DRY_RUN = process.argv.includes('--dry-run');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

async function fetchJSON(url) {
    const response = await fetch(url);
    return response.json();
}

async function fixPendingPayments() {
    console.log('='.repeat(60));
    console.log('  FIX PENDING PAYMENTS (Remote)');
    console.log(`  Mode: ${DRY_RUN ? '🔍 DRY RUN (preview only)' : '⚡ LIVE FIX (will update database)'}`);
    console.log(`  Backend: ${BACKEND_URL}`);
    console.log('='.repeat(60));
    console.log('');

    // Step 1: Fetch pending registrations from live backend
    console.log('📥 Fetching pending registrations from live backend...');
    const pendingData = await fetchJSON(
        `${BACKEND_URL}/api/registration/admin/pending-payments?secret=${ADMIN_SECRET}`
    );

    if (!pendingData.success || !pendingData.registrations) {
        console.error('❌ Failed to fetch pending registrations:', pendingData);
        process.exit(1);
    }

    const registrations = pendingData.registrations;
    console.log(`📊 Found ${registrations.length} pending registrations.\n`);

    if (registrations.length === 0) {
        console.log('🎉 No pending registrations. Database is clean!');
        process.exit(0);
    }

    let fixedCount = 0;
    let genuinelyPendingCount = 0;
    let errorCount = 0;

    const fixedList = [];
    const pendingList = [];
    const errorList = [];

    // Step 2: Check each registration against Razorpay API
    for (let i = 0; i < registrations.length; i++) {
        const reg = registrations[i];
        const orderId = reg.razorpayOrderId;

        process.stdout.write(`\r  Checking ${i + 1}/${registrations.length}: ${reg.fullName}...          `);

        if (!orderId || orderId.startsWith('order_mock')) {
            continue;
        }

        try {
            // Query Razorpay for this order's payments
            const payments = await razorpay.orders.fetchPayments(orderId);
            const capturedPayment = payments.items.find(p => p.status === 'captured');

            if (capturedPayment) {
                // ✅ Payment was ACTUALLY completed on Razorpay!
                fixedCount++;
                const paidAt = new Date(capturedPayment.created_at * 1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

                if (!DRY_RUN) {
                    // Call admin fix-payment endpoint to update the database
                    const fixUrl = `${BACKEND_URL}/api/registration/admin/fix-payment?secret=${ADMIN_SECRET}&email=${encodeURIComponent(reg.email)}&event=${encodeURIComponent(reg.event)}&paymentId=${capturedPayment.id}`;
                    const fixResult = await fetchJSON(fixUrl);

                    fixedList.push({
                        id: reg.id,
                        name: reg.fullName,
                        email: reg.email,
                        event: reg.event,
                        amount: reg.amount,
                        paymentId: capturedPayment.id,
                        paidAt,
                        fixResult: fixResult.success ? '✅ Fixed' : `⚠️ ${fixResult.message}`
                    });
                } else {
                    fixedList.push({
                        id: reg.id,
                        name: reg.fullName,
                        email: reg.email,
                        event: reg.event,
                        amount: reg.amount,
                        paymentId: capturedPayment.id,
                        paidAt,
                        fixResult: '🔍 Would fix'
                    });
                }
            } else {
                // Genuinely not paid
                genuinelyPendingCount++;
                const latestStatus = payments.items.length > 0 ? payments.items[0].status : 'no payment attempt';
                pendingList.push({
                    id: reg.id,
                    name: reg.fullName,
                    email: reg.email,
                    event: reg.event,
                    amount: reg.amount,
                    razorpayStatus: latestStatus
                });
            }

            // Rate limit: wait 350ms between Razorpay API calls
            await new Promise(resolve => setTimeout(resolve, 350));

        } catch (apiError) {
            errorCount++;
            errorList.push({
                id: reg.id,
                name: reg.fullName,
                email: reg.email,
                orderId,
                error: apiError.message
            });
        }
    }

    // Print results
    console.log('\n\n' + '='.repeat(60));
    console.log('  RESULTS');
    console.log('='.repeat(60));

    if (fixedList.length > 0) {
        console.log(`\n${DRY_RUN ? '🔍' : '✅'} PAYMENTS CONFIRMED AS COMPLETED (${fixedList.length}):`);
        console.log('-'.repeat(60));
        fixedList.forEach((r, i) => {
            console.log(`  ${i + 1}. [DB ID: ${r.id}] ${r.name}`);
            console.log(`     Email: ${r.email}`);
            console.log(`     Event: ${r.event} | Amount: ₹${r.amount}`);
            console.log(`     Razorpay Payment ID: ${r.paymentId}`);
            console.log(`     Paid At: ${r.paidAt}`);
            console.log(`     Status: ${r.fixResult}`);
            console.log('');
        });
    }

    if (pendingList.length > 0) {
        console.log(`\n⏳ GENUINELY NOT PAID (${pendingList.length}):`);
        console.log('-'.repeat(60));
        pendingList.forEach((r, i) => {
            console.log(`  ${i + 1}. [DB ID: ${r.id}] ${r.name} (${r.email})`);
            console.log(`     Event: ${r.event} | Razorpay: ${r.razorpayStatus}`);
        });
    }

    if (errorList.length > 0) {
        console.log(`\n❌ ERRORS (${errorList.length}):`);
        console.log('-'.repeat(60));
        errorList.forEach((r, i) => {
            console.log(`  ${i + 1}. [DB ID: ${r.id}] ${r.name}: ${r.error}`);
        });
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('  SUMMARY');
    console.log('='.repeat(60));
    console.log(`  Total Pending:        ${registrations.length}`);
    console.log(`  ✅ ${DRY_RUN ? 'Would Fix' : 'Fixed'}:          ${fixedCount}`);
    console.log(`  ⏳ Genuinely Pending:  ${genuinelyPendingCount}`);
    console.log(`  ❌ Errors:            ${errorCount}`);
    console.log('='.repeat(60));

    if (DRY_RUN && fixedCount > 0) {
        console.log(`\n💡 To apply fixes, run WITHOUT --dry-run:`);
        console.log(`   node scripts/fix_pending_payments_remote.js`);
    }
}

fixPendingPayments().catch(err => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
});
