const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('InvoiceItem', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    invoiceId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER },
    description: { type: DataTypes.TEXT },
    quantity: { type: DataTypes.DECIMAL(10,2), defaultValue: 1 },
    rate: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
    amount: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 }
  }, {
    tableName: 'invoice_items',
    timestamps: true
  });
};
