require('dotenv').config();
const app = require('./app');
const db = require('./config/db'); // mysql2/promise pool

const PORT = process.env.PORT || 5001;

(async () => {
  try {
    // Test DB connection
    await db.query('SELECT 1');
    console.log('MySQL connection OK');

    // Start server
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  } catch (err) {
    console.error('Failed to start', err);
    process.exit(1);
  }
})();
