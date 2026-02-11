const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from backend root .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const { Registration } = require('../models');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

async function cleanup() {
    try {
        console.log('🔄 Connecting to database...');
        await sequelize.authenticate();
        console.log('✅ Database connected.');

        // Get count of pending and failed registrations
        const pendingCount = await Registration.count({
            where: { paymentStatus: 'pending' }
        });
        const failedCount = await Registration.count({
            where: { paymentStatus: 'failed' }
        });

        console.log(`📊 Current Cleanup Target:`);
        console.log(`   🔸 Pending Registrations: ${pendingCount}`);
        console.log(`   🔸 Failed Registrations: ${failedCount}`);

        if (pendingCount === 0 && failedCount === 0) {
            console.log('🎉 No pending or failed registrations found. Database is clean!');
            process.exit(0);
        }

        console.log('🗑️  Starting cleanup process...');

        // Delete pending and failed registrations
        const deletedCount = await Registration.destroy({
            where: {
                paymentStatus: {
                    [Op.or]: ['pending', 'failed']
                }
            }
        });

        console.log(`✅ Successfully deleted ${deletedCount} registrations.`);
        console.log('✨ Database cleanup complete.');
        process.exit(0);

    } catch (error) {
        console.error('❌ Cleanup failed:', error);
        process.exit(1);
    }
}

cleanup();
