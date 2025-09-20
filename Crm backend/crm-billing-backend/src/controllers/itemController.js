const { Item } = require("../models");

// Get all items
exports.getItems = async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Error fetching items", error: err.message });
  }
};

// Create item
exports.createItem = async (req, res) => {
  try {
    const item = await Item.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: "Error creating item", error: err.message });
  }
};

// Get single item
exports.getItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Error fetching item", error: err.message });
  }
};

// Update item
exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    await item.update(req.body);
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: "Error updating item", error: err.message });
  }
};

// Delete item
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    await item.destroy();
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting item", error: err.message });
  }
};
