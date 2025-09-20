require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5001;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB auth OK');
    // sync: in production use migrations; for dev use { force: false } or { alter: true }
    await sequelize.sync({ alter: true });
    console.log('Models synced');
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  } catch (err) {
    console.error('Failed to start', err);
    process.exit(1);
  }
})();
