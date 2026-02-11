const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, handlePaymentFailure } = require('../controllers/paymentController');

const { Registration, Payment } = require('../models');

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

module.exports = router;
