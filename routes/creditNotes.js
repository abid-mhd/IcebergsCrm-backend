const express = require("express");
const router = express.Router();
const db = require("../config/db"); // mysql2/promise connection

// Create a new credit note
router.post("/", async (req, res) => {
  try {
    const { invoiceNumber, date, dueDate, partyName, amount, unpaidAmount, status, notes, paymentMode } = req.body;

    const [result] = await db.execute(
      `INSERT INTO credit_notes
       (invoiceNumber, date, dueDate, partyName, amount, unpaidAmount, status, notes, paymentMode, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [invoiceNumber, date, dueDate, partyName, amount, unpaidAmount, status, JSON.stringify(notes || []), paymentMode]
    );

    const [newCreditNote] = await db.execute(
      "SELECT * FROM credit_notes WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(newCreditNote[0]);
  } catch (err) {
    console.error("Failed to create credit note:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all credit notes
router.get("/", async (req, res) => {
  try {
    const [creditNotes] = await db.execute(
      "SELECT * FROM credit_notes ORDER BY createdAt DESC"
    );
    res.json(creditNotes);
  } catch (err) {
    console.error("Failed to fetch credit notes:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
