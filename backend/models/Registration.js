const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const calculateAmount = (registration) => {
    // Flat rate events (always ₹200)
    const flatRateEvents = [];

    // Dynamic pricing team events (₹50 per person)
    const dynamicTeamEvents = [
        'Technical Auction',
        'Technical Paper Presentation',
        'Bridge Making Competition',
        'Paper Cup Tower Madness',
        'Build Your Brain',
        'Build Your Brain',
        'Fix It',
        'Web Design Challenge',
        'Poster Presentation',
        'Poster & Model Presentation',
        'Technical Quiz Competition',
        'Technical Quiz',
        'Quiz Competition',
        'Technical Treasure Hunt',
        'BGMI Competition',
        'Free Fire (E Sport Event)'
    ];

    if (flatRateEvents.includes(registration.event)) {
        // BGMI and Free Fire: Always ₹200 (regardless of team size)
        registration.amount = 200;
    } else if (dynamicTeamEvents.includes(registration.event)) {
        // Other team events: ₹50 per person
        let teamSize = 1; // Team leader

        if (registration.teammates && Array.isArray(registration.teammates)) {
            const validTeammates = registration.teammates.filter(t => t && t.trim());
            teamSize += validTeammates.length;
        }

        // 2 players = ₹100, 3 players = ₹150, 4 players = ₹200
        registration.amount = teamSize * 50;
    } else {
        // Solo events: ₹50 per person
        registration.amount = 50;
    }
};

const Registration = sequelize.define('Registration', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: true,
            len: [10, 10]
        }
    },
    college: {
        type: DataTypes.STRING,
        allowNull: false
    },
    event: {
        type: DataTypes.STRING,
        allowNull: false
    },
    teammates: {
        type: DataTypes.JSON, // Use JSON for simplicity
        defaultValue: []
    },
    paymentStatus: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        defaultValue: 'pending'
    },
    razorpayOrderId: {
        type: DataTypes.STRING,
        allowNull: true
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
        defaultValue: 50
    },
    paymentDate: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: 'registrations',
    hooks: {
        beforeCreate: (registration) => {
            calculateAmount(registration);
        },
        beforeUpdate: (registration) => {
            calculateAmount(registration);
        }
    }
});

module.exports = Registration;
