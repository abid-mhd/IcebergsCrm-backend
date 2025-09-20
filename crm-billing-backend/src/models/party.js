const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Party", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    partyName: { type: DataTypes.STRING, allowNull: false },
    mobile: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    balance: { type: DataTypes.FLOAT, defaultValue: 0 },
    balanceType: { type: DataTypes.ENUM("To Collect", "To Pay"), allowNull: false },
    gstin: { type: DataTypes.STRING },
    pan: { type: DataTypes.STRING },
    partyType: { type: DataTypes.ENUM("Customer", "Supplier"), allowNull: false },
    category: { type: DataTypes.ENUM("Retail", "Wholesale"), allowNull: false },
    billingAddress: { type: DataTypes.TEXT },
    shippingAddress: { type: DataTypes.TEXT },
    creditPeriodValue: { type: DataTypes.INTEGER },
    creditPeriodUnit: { type: DataTypes.ENUM("days", "weeks", "months") },
    creditLimit: { type: DataTypes.FLOAT },
    bankName: { type: DataTypes.STRING },
    accountNumber: { type: DataTypes.STRING },
    ifsc: { type: DataTypes.STRING },
    branch: { type: DataTypes.STRING },
  }, {
    tableName: "parties",
    timestamps: true,
  });
};
