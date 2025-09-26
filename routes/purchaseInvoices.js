const express = require('express');
const router = express.Router();
const db = require('../config/db'); // mysql2/promise connection

// GET all purchase invoices
router.get('/', async (req, res) => {
  try {
    const [invoices] = await db.execute(
      `SELECT * FROM purchase_invoices ORDER BY createdAt DESC`
    );
    res.json(invoices);
  } catch (err) {
    console.error("Error fetching purchase invoices:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST a new purchase invoice
router.post('/', async (req, res) => {
  try {
    const {
      invoice_prefix,
      invoice_number,
      date,
      due_date,
      party,
      amount,
      unpaid,
      status,
      notes,
      bank_details,
      total
    } = req.body;

    const [result] = await db.execute(
      `INSERT INTO purchase_invoices
       (invoicePrefix, invoiceNumber, date, dueDate, party, amount, unpaid, status, notes, bankDetails, total, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        invoice_prefix,
        invoice_number,
        date,
        due_date,
        party,
        amount,
        unpaid,
        status,
        JSON.stringify(notes || []),
        JSON.stringify(bank_details || {}),
        total
      ]
    );

    // Fetch the newly created invoice
    const [newInvoice] = await db.execute(
      "SELECT * FROM purchase_invoices WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(newInvoice[0]);
  } catch (err) {
    console.error("Error creating purchase invoice:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
