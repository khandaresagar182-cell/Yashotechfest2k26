const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Registration = require('./Registration');

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    razorpayOrderId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    razorpayPaymentId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    razorpaySignature: {
        type: DataTypes.STRING,
        allowNull: true
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    currency: {
        type: DataTypes.STRING,
        defaultValue: 'INR'
    },
    status: {
        type: DataTypes.ENUM('created', 'authorized', 'captured', 'failed'),
        defaultValue: 'created'
    },
    email: {
        type: DataTypes.STRING
    },
    phone: {
        type: DataTypes.STRING
    },
    failureReason: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: 'payments'
});

// Setup Association is tricky in separate files due to circular dependency. 
// We will set up associations in a central init file or just here if careful.
// Ideally, Registration should also know about Payment.

module.exports = Payment;
