const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection (MySQL)
console.log('Loading database config...');
const sequelize = require('./config/database');

console.log('Syncing database...');
// Sync Database
sequelize.sync({ alter: true }) // Sync schema changes (removed unique constraints on email/phone)
    .then(() => console.log('✅ MySQL Database Connected & Synced'))
    .catch((err) => console.error('❌ Database Connection Error:', err));

// Routes
app.use('/api/registration', require('./routes/registration'));
// app.use('/api/admin', require('./routes/admin')); // Admin Dashboard Removed
// app.use('/api/payment', require('./routes/payment')); // Integrated into registration

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'YashoTech Fest Backend is running',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: true,
        message: err.message || 'Internal Server Error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: true,
        message: 'Route not found'
    });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📅 YashoTech Fest 2K26 Backend`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
