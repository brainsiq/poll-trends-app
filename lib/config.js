module.exports = {
  opinionBeeApiKey: process.env.OPINIONBEE_API_KEY,
  guardianApiKey: process.env.GUARDIAN_API_KEY,
  port: process.env.PORT || 3000,
  enabledCompanies: ['YG', 'IPSOS', 'SRVN', 'ICM'],
  enabledParties: ['CON', 'LAB', 'LD', 'UKIP', 'GRN']
};
