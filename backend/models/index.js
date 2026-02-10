const Registration = require('./Registration');
const Payment = require('./Payment');

// Define Relationships
Registration.hasMany(Payment, { foreignKey: 'registrationId' });
Payment.belongsTo(Registration, { foreignKey: 'registrationId' });

module.exports = {
    Registration,
    Payment
};
