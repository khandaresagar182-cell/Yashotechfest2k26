const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

console.log(`🔌 Attempting to connect to MySQL:
    Host: ${process.env.DB_HOST || 'localhost'}
    User: ${process.env.DB_USER || 'root'}
    Database: ${process.env.DB_NAME || 'yashotech_fest'}
    Port: ${process.env.DB_PORT || 3306}
`);

const sequelize = new Sequelize(
    process.env.DB_NAME || 'yashotech_fest',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || '',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        dialectOptions: {
            connectTimeout: 60000 // Increase connection timeout to 60 seconds
        },
        logging: false, // Set to console.log to see SQL queries
        pool: {
            max: 5,
            min: 0,
            acquire: 60000,
            idle: 10000
        }
    }
);

module.exports = sequelize;
