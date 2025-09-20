require('dotenv').config();
const { sequelize, models } = require('../src/models');

async function run() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    await models.Client.bulkCreate([
      { name: 'Acme Industries', phone: '9999999999', email: 'acct@acme.com', address: '123 Industrial Rd' },
      { name: 'Home Owner', phone: '8888888888', email: 'home@example.com', address: '45 Main St' }
    ]);
    await models.Product.bulkCreate([
      { name: 'AC Service', sku: 'SV-AC-001', rate: 2500.00, description: 'Full service' },
      { name: 'Compressor', sku: 'PR-001', rate: 7500.00 },
      { name: 'Installation', sku: 'SERV-INS', rate: 1500.00 }
    ]);
    console.log('Seeded.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
