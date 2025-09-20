const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Payment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    invoiceId: { type: DataTypes.INTEGER },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    amount: { type: DataTypes.DECIMAL(12,2), allowNull: false },
    method: { type: DataTypes.STRING },
    reference: { type: DataTypes.STRING },
  }, {
    tableName: 'payments',
    timestamps: true
  });
};
