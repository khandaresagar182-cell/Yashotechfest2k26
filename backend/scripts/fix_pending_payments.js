/**
 * FIX PENDING PAYMENTS SCRIPT
 * ============================
 * This script safely fixes "pending" payments in the database by:
 * 1. Using the Razorpay API to fetch ALL orders and their payment statuses
 * 2. Cross-referencing with the database to find mismatches
 * 3. Only updating records to 'completed' if Razorpay confirms payment was captured
 * 
 * SAFE: This script DOES NOT blindly update. It only fixes confirmed payments.
 * 
 * IMPORTANT: Set DB_HOST to the Railway PUBLIC proxy host when running locally.
 * The internal host (mysql.railway.internal) only works from within Railway.
 * 
 * Usage:
 *   DRY RUN (preview only): node scripts/fix_pending_payments.js --dry-run
 *   LIVE FIX:               node scripts/fix_pending_payments.js
 * 
 * Environment Override (for local connection to Railway):
 *   set DB_HOST=<railway-public-host> & set DB_PORT=<public-port> & node scripts/fix_pending_payments.js --dry-run
 */

const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from backend root .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const Razorpay = require('razorpay');
const { Registration, Payment } = require('../models');
const sequelize = require('../config/database');

const DRY_RUN = process.argv.includes('--dry-run');

// Initialize Razorpay with real keys
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

async function fixPendingPayments() {
    try {
        console.log('='.repeat(60));
        console.log('  FIX PENDING PAYMENTS SCRIPT');
        console.log(`  Mode: ${DRY_RUN ? '🔍 DRY RUN (preview only)' : '⚡ LIVE (will update database)'}`);
        console.log('='.repeat(60));
        console.log('');

        // Connect to database
        console.log('🔄 Connecting to database...');
        await sequelize.authenticate();
        console.log('✅ Database connected.\n');

        // Step 1: Fetch all pending registrations that have a Razorpay order ID
        const pendingRegistrations = await Registration.findAll({
            where: { paymentStatus: 'pending' },
            order: [['createdAt', 'DESC']]
        });

        console.log(`📊 Found ${pendingRegistrations.length} pending registrations.\n`);

        if (pendingRegistrations.length === 0) {
            console.log('🎉 No pending registrations found. Database is clean!');
            process.exit(0);
        }

        let fixedCount = 0;
        let alreadyPendingCount = 0;
        let noOrderIdCount = 0;
        let errorCount = 0;
        let mockOrderCount = 0;

        const results = [];

        for (const reg of pendingRegistrations) {
            const orderId = reg.razorpayOrderId;

            // Skip registrations without an order ID
            if (!orderId) {
                noOrderIdCount++;
                results.push({
                    id: reg.id,
                    name: reg.fullName,
                    email: reg.email,
                    event: reg.event,
                    status: '⚠️ NO ORDER ID',
                    razorpayStatus: 'N/A'
                });
                continue;
            }

            // Skip mock orders (they are test/development orders)
            if (orderId.startsWith('order_mock')) {
                mockOrderCount++;
                results.push({
                    id: reg.id,
                    name: reg.fullName,
                    email: reg.email,
                    event: reg.event,
                    status: '🧪 MOCK ORDER (skipped)',
                    razorpayStatus: 'mock'
                });
                continue;
            }

            try {
                // Query Razorpay API for the order's actual status
                const order = await razorpay.orders.fetch(orderId);

                // Also fetch payments for this order
                const payments = await razorpay.orders.fetchPayments(orderId);

                // Check if any payment was captured
                const capturedPayment = payments.items.find(p => p.status === 'captured');

                if (capturedPayment) {
                    // ✅ PAYMENT WAS ACTUALLY COMPLETED - FIX IT
                    fixedCount++;

                    if (!DRY_RUN) {
                        // Update Registration
                        reg.paymentStatus = 'completed';
                        reg.razorpayPaymentId = capturedPayment.id;
                        reg.paymentDate = new Date(capturedPayment.created_at * 1000);
                        await reg.save();

                        // Update Payment record
                        const paymentRecord = await Payment.findOne({ where: { razorpayOrderId: orderId } });
                        if (paymentRecord) {
                            paymentRecord.status = 'captured';
                            paymentRecord.razorpayPaymentId = capturedPayment.id;
                            await paymentRecord.save();
                        }
                    }

                    results.push({
                        id: reg.id,
                        name: reg.fullName,
                        email: reg.email,
                        event: reg.event,
                        amount: reg.amount,
                        status: DRY_RUN ? '🔍 WOULD FIX → completed' : '✅ FIXED → completed',
                        razorpayStatus: 'captured',
                        paymentId: capturedPayment.id,
                        paidAt: new Date(capturedPayment.created_at * 1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
                    });
                } else {
                    // Payment genuinely not completed on Razorpay side
                    alreadyPendingCount++;

                    const latestPaymentStatus = payments.items.length > 0
                        ? payments.items[0].status
                        : 'no payments';

                    results.push({
                        id: reg.id,
                        name: reg.fullName,
                        email: reg.email,
                        event: reg.event,
                        amount: reg.amount,
                        status: '⏳ GENUINELY PENDING',
                        razorpayStatus: `order: ${order.status}, payment: ${latestPaymentStatus}`
                    });
                }

                // Small delay to avoid hitting Razorpay rate limits
                await new Promise(resolve => setTimeout(resolve, 300));

            } catch (apiError) {
                errorCount++;
                results.push({
                    id: reg.id,
                    name: reg.fullName,
                    email: reg.email,
                    event: reg.event,
                    orderId: orderId,
                    status: '❌ API ERROR',
                    error: apiError.message
                });
            }
        }

        // Print detailed results
        console.log('\n' + '='.repeat(60));
        console.log('  DETAILED RESULTS');
        console.log('='.repeat(60));

        // Group results by status
        const fixedResults = results.filter(r => r.status.includes('FIXED') || r.status.includes('WOULD FIX'));
        const pendingResults = results.filter(r => r.status.includes('GENUINELY PENDING'));
        const otherResults = results.filter(r => !r.status.includes('FIXED') && !r.status.includes('WOULD FIX') && !r.status.includes('GENUINELY PENDING'));

        if (fixedResults.length > 0) {
            console.log(`\n${DRY_RUN ? '🔍' : '✅'} PAYMENTS CONFIRMED AS COMPLETED (${fixedResults.length}):`);
            console.log('-'.repeat(60));
            fixedResults.forEach((r, i) => {
                console.log(`  ${i + 1}. [ID: ${r.id}] ${r.name} (${r.email})`);
                console.log(`     Event: ${r.event} | Amount: ₹${r.amount}`);
                console.log(`     Razorpay Payment: ${r.paymentId}`);
                console.log(`     Paid At: ${r.paidAt}`);
                console.log('');
            });
        }

        if (pendingResults.length > 0) {
            console.log(`\n⏳ GENUINELY PENDING / NOT PAID (${pendingResults.length}):`);
            console.log('-'.repeat(60));
            pendingResults.forEach((r, i) => {
                console.log(`  ${i + 1}. [ID: ${r.id}] ${r.name} (${r.email})`);
                console.log(`     Event: ${r.event} | Amount: ₹${r.amount}`);
                console.log(`     Razorpay: ${r.razorpayStatus}`);
                console.log('');
            });
        }

        if (otherResults.length > 0) {
            console.log(`\n⚠️ OTHER (${otherResults.length}):`);
            console.log('-'.repeat(60));
            otherResults.forEach((r, i) => {
                console.log(`  ${i + 1}. [ID: ${r.id}] ${r.name} (${r.email})`);
                console.log(`     Status: ${r.status}`);
                if (r.error) console.log(`     Error: ${r.error}`);
                console.log('');
            });
        }

        // Summary
        console.log('\n' + '='.repeat(60));
        console.log('  SUMMARY');
        console.log('='.repeat(60));
        console.log(`  Total Pending Records:     ${pendingRegistrations.length}`);
        console.log(`  ✅ ${DRY_RUN ? 'Would Fix' : 'Fixed'}:              ${fixedCount}`);
        console.log(`  ⏳ Genuinely Pending:       ${alreadyPendingCount}`);
        console.log(`  🧪 Mock Orders (skipped):   ${mockOrderCount}`);
        console.log(`  ⚠️ No Order ID:             ${noOrderIdCount}`);
        console.log(`  ❌ API Errors:              ${errorCount}`);
        console.log('='.repeat(60));

        if (DRY_RUN && fixedCount > 0) {
            console.log(`\n💡 To apply fixes, run WITHOUT --dry-run:`);
            console.log(`   node scripts/fix_pending_payments.js`);
        }

        process.exit(0);

    } catch (error) {
        console.error('❌ Script failed:', error);
        process.exit(1);
    }
}

fixPendingPayments();
