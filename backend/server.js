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
sequelize.sync({ alter: true }) // Sync schema changes
    .then(async () => {
        console.log('✅ MySQL Database Connected & Synced');

        // Automatically fix duplicate constraints on startup
        try {
            const queryInterface = sequelize.getQueryInterface();
            console.log('🔧 Running database constraint cleanup...');

            // Try to remove unique constraints that might block duplicates
            const constraints = ['email', 'phone', 'registrations_email_unique', 'registrations_phone_unique'];

            for (const constraint of constraints) {
                try {
                    await queryInterface.removeIndex('registrations', constraint);
                    console.log(`✅ Removed index: ${constraint}`);
                } catch (e) { /* ignore if not exists */ }

                try {
                    await queryInterface.removeConstraint('registrations', constraint);
                    console.log(`✅ Removed constraint: ${constraint}`);
                } catch (e) { /* ignore if not exists */ }
            }
            console.log('✨ Database constraints cleanup completed.');
        } catch (dbFixError) {
            console.warn('⚠️ Database auto-fix warning:', dbFixError.message);
        }
    })
    .catch((err) => console.error('❌ Database Connection Error:', err));

// Routes
const registrationRoutes = require('./routes/registration');
const paymentRoutes = require('./routes/payment');
const exportRoutes = require('./routes/export');

app.use('/api/registration', registrationRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/export', exportRoutes);
// app.use('/api/admin', require('./routes/admin')); // Admin Dashboard Removed

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
