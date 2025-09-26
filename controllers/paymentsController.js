const db = require("../config/db");

// ✅ Create a payment & update invoice status
exports.create = async (req, res) => {
  try {
    const { invoiceId, date, amount, method, reference } = req.body;

    if (!invoiceId || !amount || !date || !method) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Insert payment
    const [result] = await db.execute(
      `INSERT INTO payments (invoiceId, date, amount, method, reference, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [invoiceId, date, amount, method, reference || null]
    );

    // Fetch invoice with its total + payments
    const [[invoice]] = await db.execute(
      `SELECT id, total, status FROM invoices WHERE id = ?`,
      [invoiceId]
    );

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const [payments] = await db.execute(
      `SELECT amount FROM payments WHERE invoiceId = ?`,
      [invoiceId]
    );

    const paid = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    let status = invoice.status;

    if (paid >= parseFloat(invoice.total)) status = "paid";
    else if (paid > 0) status = "partial";

    // Update invoice status
    await db.execute(
      `UPDATE invoices SET status = ?, updatedAt = NOW() WHERE id = ?`,
      [status, invoiceId]
    );

    res.status(201).json({
      message: "Payment created successfully",
      paymentId: result.insertId,
      newStatus: status,
      totalPaid: paid
    });
  } catch (err) {
    console.error("Error creating payment:", err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

// ✅ Get all payments
exports.list = async (req, res) => {
  try {
    const [payments] = await db.execute("SELECT * FROM payments ORDER BY createdAt DESC");
    res.json(payments);
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};
