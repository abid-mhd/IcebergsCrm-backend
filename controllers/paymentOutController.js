const db = require("../config/db");

// ✅ Get all payments out
exports.getAllPaymentsOut = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM payments_out ORDER BY createdAt DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching payments out:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// ✅ Create a new payment out
exports.createPaymentOut = async (req, res) => {
  try {
    const {
      partyId,
      amount,
      paymentDate,
      paymentMode,
      reference,
      notes
    } = req.body;

    const [result] = await db.execute(
      `INSERT INTO payments_out 
        (partyId, amount, paymentDate, paymentMode, reference, notes, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [partyId, amount, paymentDate, paymentMode, reference || null, notes || null]
    );

    res.status(201).json({ message: "Payment created successfully", id: result.insertId });
  } catch (err) {
    console.error("Error creating payment:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// ✅ Delete a payment out
exports.deletePaymentOut = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.execute("SELECT * FROM payments_out WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Payment not found" });
    }

    await db.execute("DELETE FROM payments_out WHERE id = ?", [id]);
    res.json({ message: "Payment deleted successfully" });
  } catch (err) {
    console.error("Error deleting payment:", err);
    res.status(500).json({ error: "Database error" });
  }
};
