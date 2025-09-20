const { Sequelize } = require("sequelize");
const dbConfig = require("../config/db");

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

const models = {};

// ⬇️ Existing models
models.Client = require("./client")(sequelize);
models.Product = require("./product")(sequelize);
models.Invoice = require("./invoice")(sequelize);
models.InvoiceItem = require("./invoiceItem")(sequelize);
models.Payment = require("./payment")(sequelize);

// ⬇️ Add Party model here
models.Party = require("./party")(sequelize);

module.exports = { sequelize, models };
