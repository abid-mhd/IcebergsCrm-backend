const express = require("express");
const router = express.Router();
const db = require("../config/db"); // mysql2/promise connection

// Create new debit note
router.post("/", async (req, res) => {
  try {
    const { debitNumber, party, date, due, amount, unpaid, status } = req.body;

    const [result] = await db.execute(
      `INSERT INTO debit_notes 
       (debitNumber, party, date, due, amount, unpaid, status, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [debitNumber, party, date, due, amount, unpaid, status]
    );

    const [newNote] = await db.execute(
      "SELECT * FROM debit_notes WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(newNote[0]);
  } catch (err) {
    console.error("Error creating debit note:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all debit notes
router.get("/", async (req, res) => {
  try {
    const [debitNotes] = await db.execute(
      "SELECT * FROM debit_notes ORDER BY createdAt DESC"
    );
    res.json(debitNotes);
  } catch (err) {
    console.error("Error fetching debit notes:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get single debit note by ID
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM debit_notes WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Debit Note not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching debit note:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update debit note
router.put("/:id", async (req, res) => {
  try {
    const { debitNumber, party, date, due, amount, unpaid, status } = req.body;

    await db.execute(
      `UPDATE debit_notes 
       SET debitNumber=?, party=?, date=?, due=?, amount=?, unpaid=?, status=?, updatedAt=NOW()
       WHERE id=?`,
      [debitNumber, party, date, due, amount, unpaid, status, req.params.id]
    );

    const [updated] = await db.execute(
      "SELECT * FROM debit_notes WHERE id = ?",
      [req.params.id]
    );

    res.json({ message: "Debit Note updated", debitNote: updated[0] });
  } catch (err) {
    console.error("Error updating debit note:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete debit note
router.delete("/:id", async (req, res) => {
  try {
    await db.execute("DELETE FROM debit_notes WHERE id = ?", [req.params.id]);
    res.json({ message: "Debit Note deleted" });
  } catch (err) {
    console.error("Error deleting debit note:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
