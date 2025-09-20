const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    sku: { type: DataTypes.STRING },
    rate: { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },
    description: { type: DataTypes.TEXT },
  }, {
    tableName: 'products',
    timestamps: true
  });
};
