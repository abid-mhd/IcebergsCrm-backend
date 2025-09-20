module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define("Item", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    category: { type: DataTypes.STRING },
    type: { type: DataTypes.STRING }, // Product / Service
    stock: { type: DataTypes.STRING }, // e.g. "20 PCS"
    sellingPrice: { type: DataTypes.FLOAT },
    purchasePrice: { type: DataTypes.FLOAT },
    gstRate: { type: DataTypes.STRING },
    taxType: { type: DataTypes.STRING },
    measuringUnit: { type: DataTypes.STRING },
    hsnCode: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    asOfDate: { type: DataTypes.DATE }
  });
  return Item;
};
