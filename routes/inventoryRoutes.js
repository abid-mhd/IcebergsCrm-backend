const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");

// POST → create new item
router.post("/", inventoryController.createItem);

// GET → get all items
router.get("/", inventoryController.getItems);

module.exports = router;
