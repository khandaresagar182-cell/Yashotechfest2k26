const express = require('express');
const router = express.Router();
const { Registration, Payment } = require('../models');

// GET /api/export?key=ADMIN_PASSWORD
router.get('/', async (req, res) => {
    try {
        // 1. Simple Security Check
        const adminKey = process.env.ADMIN_PASSWORD;
        if (!req.query.key || req.query.key !== adminKey) {
            return res.status(403).send('Access Denied: Invalid Admin Key');
        }

        // 2. Fetch all registrations (with payment info if needed, but keeping it simple for now)
        const registrations = await Registration.findAll({
            order: [['createdAt', 'DESC']],
            raw: true // Get plain JSON objects
        });

        if (!registrations.length) {
            return res.send('No registrations found');
        }

        // 3. Define CSV Headers
        const headers = [
            'ID',
            'Full Name',
            'Email',
            'Phone',
            'College',
            'Event',
            'Team Members', // Combined field
            'Payment Status',
            'Amount',
            'Payment ID',
            'Date'
        ];

        // 4. Convert Data to CSV Rows
        const rows = registrations.map(reg => {
            // Combine teammates into one string
            const teammates = [
                reg.teammate2,
                reg.teammate3,
                reg.teammate4,
                reg.teammate5
            ].filter(Boolean).join(', ');

            // Escape fields for CSV (handle commas and quotes)
            const escape = (text) => {
                if (!text) return '';
                const stringText = String(text);
                // If contains comma, quote, or newline, wrap in quotes and escape quotes
                if (stringText.includes(',') || stringText.includes('"') || stringText.includes('\n')) {
                    return `"${stringText.replace(/"/g, '""')}"`;
                }
                return stringText;
            };

            return [
                reg.id,
                escape(reg.fullName),
                escape(reg.email),
                escape(reg.phone),
                escape(reg.college),
                escape(reg.event),
                escape(teammates),
                escape(reg.paymentStatus),
                reg.amount,
                escape(reg.razorpayPaymentId),
                escape(reg.createdAt)
            ].join(',');
        });

        // 5. Combine Headers and Rows
        const csvContent = [headers.join(','), ...rows].join('\n');

        // 6. Send Response as File Download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=registrations-${Date.now()}.csv`);
        res.status(200).send(csvContent);

    } catch (error) {
        console.error('Export Error:', error);
        res.status(500).send('Failed to export data');
    }
});

module.exports = router;
