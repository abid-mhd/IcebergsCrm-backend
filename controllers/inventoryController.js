const db = require("../config/db");

exports.createItem = async (req, res) => {
  try {
    const {
      name,
      code,
      stock,
      sellingPrice,
      purchasePrice,
      type,
      category,
      taxType,
      gstRate,
      measuringUnit,
      asOfDate,
      description
    } = req.body;

    const [result] = await db.execute(
      `INSERT INTO inventory 
        (name, code, stock, sellingPrice, purchasePrice, type, category, taxType, gstRate, measuringUnit, asOfDate, description) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        code,
        stock,
        sellingPrice,
        purchasePrice,
        type,
        category,
        taxType,
        gstRate,
        measuringUnit,
        asOfDate,
        description
      ]
    );

    res.status(201).json({
      id: result.insertId,
      ...req.body,
    });
  } catch (error) {
    console.error("❌ Error creating item:", error);
    res.status(500).json({ message: "Failed to create item" });
  }
};

// ✅ Get all inventory items
exports.getItems = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM inventory ORDER BY createdAt DESC");
    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching items:", error);
    res.status(500).json({ message: "Failed to fetch items" });
  }
};
