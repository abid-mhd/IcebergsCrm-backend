const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Client', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    address: { type: DataTypes.TEXT },
  }, {
    tableName: 'clients',
    timestamps: true
  });
};
