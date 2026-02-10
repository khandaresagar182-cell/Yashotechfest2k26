const express = require('express');
const router = express.Router();
const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = require('../controllers/paymentController');

// This route file exists for potential webhook handling
// Currently using frontend-based payment verification

module.exports = router;
