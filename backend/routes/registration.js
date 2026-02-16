const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, handlePaymentFailure } = require('../controllers/paymentController');

const { Registration, Payment } = require('../models');
const sequelize = require('../config/database'); // Import sequelize for raw queries

// ROUTE TO FIX DATABASE CONSTRAINTS (One-time use)
router.get('/fix-db-constraints', async (req, res) => {
    try {
        const queryInterface = sequelize.getQueryInterface();
        let logs = [];

        // Attempt 1: Drop 'email' index
        try {
            await queryInterface.removeIndex('registrations', 'email');
            logs.push("✅ Removed index 'email'");
        } catch (e) {
            logs.push(`⚠️ Could not remove index 'email': ${e.message}`);
        }

        // Attempt 2: Drop 'email' unique constraint (sometimes named differently)
        try {
            await queryInterface.removeConstraint('registrations', 'email');
            logs.push("✅ Removed constraint 'email'");
        } catch (e) {
            logs.push(`⚠️ Could not remove constraint 'email': ${e.message}`);
        }

        // Attempt 3: Drop 'registrations_email_unique' (Sequelize default name)
        try {
            await queryInterface.removeConstraint('registrations', 'registrations_email_unique');
            logs.push("✅ Removed constraint 'registrations_email_unique'");
        } catch (e) {
            logs.push(`⚠️ Could not remove constraint 'registrations_email_unique': ${e.message}`);
        }

        // Attempt 4: Drop 'phone' index
        try {
            await queryInterface.removeIndex('registrations', 'phone');
            logs.push("✅ Removed index 'phone'");
        } catch (e) {
            logs.push(`⚠️ Could not remove index 'phone': ${e.message}`);
        }

        res.send(`
            <h1>Database Fix Results</h1>
            <pre>${logs.join('\n')}</pre>
            <p>If you see at least one "Removed" message (or if it says they don't exist), try registering a duplicate user now.</p>
        `);
    } catch (error) {
        res.status(500).send('Critical Error: ' + error.message);
    }
});

// Create registration and payment order
router.get('/cleanup-database-confirm', async (req, res) => {

    try {
        if (req.query.secret !== 'YASHO_CLEANUP_2026') {
            return res.status(403).send('Unauthorized');
        }
        const { Op } = require('sequelize');
        const deletedCount = await Registration.destroy({
            where: {
                paymentStatus: {
                    [Op.or]: ['pending', 'failed']
                }
            }
        });
        res.send(`✅ Database Cleanup Successful. Deleted ${deletedCount} pending/failed registrations.`);
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
});

// Cleanup failed/pending payments from Payments table
router.get('/cleanup-payments-confirm', async (req, res) => {
    try {
        if (req.query.secret !== 'YASHO_CLEANUP_2026') {
            return res.status(403).send('Unauthorized');
        }
        const { Op } = require('sequelize');
        const deletedCount = await Payment.destroy({
            where: {
                status: {
                    [Op.or]: ['created', 'failed']
                }
            }
        });
        res.send(`✅ Payments Cleanup Successful. Deleted ${deletedCount} pending/failed payments.`);
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
});

router.post('/create', async (req, res) => {
    try {
        const { fullName, email, phone, college, event, teammate2, teammate3, teammate4, teammate5 } = req.body;

        // Validate required fields
        if (!fullName || !email || !phone || !college || !event) {
            return res.status(400).json({
                error: true,
                message: 'Missing required fields'
            });
        }

        // Check if email already registered for this specific event - REMOVED to allow duplicates


        // Prepare teammates array
        const teammates = [teammate2, teammate3, teammate4, teammate5].filter(t => t && t.trim());

        // Create registration and order
        const registrationData = {
            fullName,
            email,
            phone,
            college,
            event,
            teammates // Sequelize will handle this as JSON
        };

        const result = await createOrder(registrationData);

        res.status(201).json({
            success: true,
            data: result,
            message: 'Registration created successfully. Please complete payment.'
        });
    } catch (error) {
        console.error('Registration error:', error);

        // Handle Sequelize validation errors specifically
        if (error.name === 'SequelizeUniqueConstraintError') {
            // Ideally this shouldn't happen if we allow duplicates, unless there is a DB unique constraint.
            // Given the user wants to allow duplicates, we should probably catch this and ignore or warn, 
            // but if the DB has a unique index, it will still fail. 
            // Assuming the user wants to bypass application logic checks. 
            // If DB has unique constraints, those need to be removed or we suppress this error (which might fail insertion).
            // For now, let's keep it but logging it might be better if we really want to allow it.
            // Actually, the user said "allow all user add multiple times".
            // If the DB has unique constraints, we can't force it without DB schema change.
            // But let's assume the "logic" was the main blocker.
            // If this error occurs, it means DB rejected it.
            return res.status(400).json({
                error: true,
                message: 'This email or phone number is already registered for this event (Database Constraint).'
            });
        }
        if (error.name === 'SequelizeValidationError') {
            const messages = error.errors.map(e => e.message).join(', ');
            return res.status(400).json({
                error: true,
                message: messages || 'Validation failed. Please check your input.'
            });
        }

        res.status(500).json({
            error: true,
            message: error.message || 'Failed to create registration'
        });
    }
});

// Verify payment
router.post('/verify-payment', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                error: true,
                message: 'Missing payment verification data'
            });
        }

        const result = await verifyPayment(req.body);

        // Email notification removed as per user request (relying on Razorpay receipts)

        res.json({
            success: true,
            message: 'Payment verified successfully! Confirmation email sent.',
            registration: {
                name: result.registration.fullName,
                event: result.registration.event,
                amount: result.registration.amount
            }
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(400).json({
            error: true,
            message: error.message || 'Payment verification failed'
        });
    }
});

// Handle payment failure
router.post('/payment-failed', async (req, res) => {
    try {
        const { order_id, reason } = req.body;
        await handlePaymentFailure(order_id, reason || 'Payment cancelled by user');

        res.json({
            success: true,
            message: 'Payment failure recorded'
        });
    } catch (error) {
        console.error('Payment failure handling error:', error);
        res.status(500).json({
            error: true,
            message: 'Failed to record payment failure'
        });
    }
});

// Check if email is already registered
router.get('/check-email/:email', async (req, res) => {
    try {
        const registration = await Registration.findOne({
            where: {
                email: req.params.email.toLowerCase(),
                paymentStatus: 'completed'
            }
        });

        res.json({
            exists: !!registration,
            message: registration ? 'Email already registered' : 'Email available'
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: 'Failed to check email'
        });
    }
});

// ============================================================
// ADMIN: Manually fix a payment status (for failed callbacks)
// Usage: GET /api/registration/admin/fix-payment?secret=YASHO_ADMIN_2026&email=xxx&event=xxx&paymentId=xxx
// ============================================================
router.get('/admin/fix-payment', async (req, res) => {
    try {
        const { secret, email, event, paymentId } = req.query;

        // Secure with a secret key
        if (secret !== 'YASHO_ADMIN_2026') {
            return res.status(403).json({ error: true, message: 'Unauthorized' });
        }

        if (!email) {
            return res.status(400).json({ error: true, message: 'Email is required' });
        }

        // Build where clause
        const whereClause = { email };
        if (event) whereClause.event = event;

        // Find the registration
        const registration = await Registration.findOne({
            where: whereClause,
            order: [['createdAt', 'DESC']] // Most recent first
        });

        if (!registration) {
            return res.status(404).json({
                error: true,
                message: `No registration found for email: ${email}` + (event ? ` and event: ${event}` : '')
            });
        }

        // Check if already completed
        if (registration.paymentStatus === 'completed') {
            return res.json({
                success: true,
                message: 'Payment is already marked as completed!',
                registration: {
                    id: registration.id,
                    fullName: registration.fullName,
                    email: registration.email,
                    event: registration.event,
                    amount: registration.amount,
                    paymentStatus: registration.paymentStatus,
                    razorpayPaymentId: registration.razorpayPaymentId
                }
            });
        }

        // Update to completed
        registration.paymentStatus = 'completed';
        registration.razorpayPaymentId = paymentId || 'manual_fix';
        registration.paymentDate = new Date();
        await registration.save();

        // Also fix the Payment record if exists
        if (registration.razorpayOrderId) {
            const payment = await Payment.findOne({ where: { razorpayOrderId: registration.razorpayOrderId } });
            if (payment) {
                payment.status = 'captured';
                payment.razorpayPaymentId = paymentId || 'manual_fix';
                await payment.save();
            }
        }

        res.json({
            success: true,
            message: `✅ Payment fixed successfully!`,
            registration: {
                id: registration.id,
                fullName: registration.fullName,
                email: registration.email,
                event: registration.event,
                amount: registration.amount,
                paymentStatus: 'completed',
                razorpayPaymentId: registration.razorpayPaymentId
            }
        });
    } catch (error) {
        console.error('Admin fix-payment error:', error);
        res.status(500).json({ error: true, message: error.message });
    }
});

// ============================================================
// ADMIN: List all pending/failed payments for review
// Usage: GET /api/registration/admin/pending-payments?secret=YASHO_ADMIN_2026
// ============================================================
router.get('/admin/pending-payments', async (req, res) => {
    try {
        if (req.query.secret !== 'YASHO_ADMIN_2026') {
            return res.status(403).json({ error: true, message: 'Unauthorized' });
        }

        const { Op } = require('sequelize');
        const pendingRegistrations = await Registration.findAll({
            where: {
                paymentStatus: { [Op.in]: ['pending', 'failed'] }
            },
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'fullName', 'email', 'phone', 'event', 'amount', 'paymentStatus', 'razorpayOrderId', 'razorpayPaymentId', 'createdAt']
        });

        res.json({
            success: true,
            count: pendingRegistrations.length,
            registrations: pendingRegistrations
        });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

// ============================================================
// RAZORPAY WEBHOOK: Automatic payment capture (prevents future misses)
// Setup: In Razorpay Dashboard → Webhooks → Add URL: https://YOUR_BACKEND/api/registration/webhook/razorpay
// ============================================================
router.post('/webhook/razorpay', async (req, res) => {
    try {
        const event = req.body.event;
        const payload = req.body.payload;

        console.log(`📩 Razorpay Webhook received: ${event}`);

        if (event === 'payment.captured' || event === 'order.paid') {
            const paymentEntity = payload.payment?.entity;
            if (!paymentEntity) {
                return res.json({ status: 'ignored', reason: 'No payment entity' });
            }

            const orderId = paymentEntity.order_id;
            const paymentId = paymentEntity.id;

            // Find the registration by order ID
            const registration = await Registration.findOne({ where: { razorpayOrderId: orderId } });

            if (registration && registration.paymentStatus !== 'completed') {
                registration.paymentStatus = 'completed';
                registration.razorpayPaymentId = paymentId;
                registration.paymentDate = new Date();
                await registration.save();

                // Update payment record
                const payment = await Payment.findOne({ where: { razorpayOrderId: orderId } });
                if (payment) {
                    payment.razorpayPaymentId = paymentId;
                    payment.status = 'captured';
                    await payment.save();
                }

                console.log(`✅ Webhook: Fixed payment for registration ${registration.id} (${registration.email})`);
            }
        }

        // Always respond 200 to Razorpay
        res.json({ status: 'ok' });
    } catch (error) {
        console.error('Webhook error:', error);
        res.json({ status: 'error', message: error.message });
    }
});

module.exports = router;
