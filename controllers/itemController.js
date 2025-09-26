const db = require("../config/db");

// ✅ Get all items
exports.getItems = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM items ORDER BY createdAt DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).json({ message: "Error fetching items" });
  }
};

// ✅ Create item
exports.createItem = async (req, res) => {
  try {
    const { name, sku, rate, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Item name is required" });
    }

    const [result] = await db.execute(
      "INSERT INTO items (name, sku, rate, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())",
      [name, sku || null, rate || 0, description || null]
    );

    res.status(201).json({ message: "Item created", id: result.insertId });
  } catch (err) {
    console.error("Error creating item:", err);
    res.status(400).json({ message: "Error creating item" });
  }
};

// ✅ Get single item by ID
exports.getItem = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM items WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Item not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching item:", err);
    res.status(500).json({ message: "Error fetching item" });
  }
};

// ✅ Update item
exports.updateItem = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM items WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Item not found" });

    const { name, sku, rate, description } = req.body;

    await db.execute(
      "UPDATE items SET name=?, sku=?, rate=?, description=?, updatedAt=NOW() WHERE id=?",
      [name, sku, rate, description, req.params.id]
    );

    res.json({ message: "Item updated" });
  } catch (err) {
    console.error("Error updating item:", err);
    res.status(400).json({ message: "Error updating item" });
  }
};

// ✅ Delete item
exports.deleteItem = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM items WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Item not found" });

    await db.execute("DELETE FROM items WHERE id = ?", [req.params.id]);

    res.json({ message: "Item deleted" });
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ message: "Error deleting item" });
  }
};
