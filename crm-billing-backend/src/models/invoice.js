const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Invoice', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    invoiceNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    dueDate: { type: DataTypes.DATEONLY },
    clientId: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.ENUM('draft','sent','paid','partial','overdue'), defaultValue: 'draft' },
    subTotal: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
    tax: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
    discount: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
    total: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
    notes: { type: DataTypes.TEXT }
  }, {
    tableName: 'invoices',
    timestamps: true
  });
};
