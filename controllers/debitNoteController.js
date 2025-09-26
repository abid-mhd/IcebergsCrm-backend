const db = require("../config/db");

// ✅ Create a debit note
exports.createDebitNote = async (req, res) => {
  try {
    const { debitNumber, party, date, due, amount, unpaid, status } = req.body;

    if (!debitNumber || !party || !date || !due || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [result] = await db.execute(
      `INSERT INTO debit_notes (debitNumber, party, date, due, amount, unpaid, status, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [debitNumber, party, date, due, amount, unpaid || 0, status || "Unpaid"]
    );

    res.status(201).json({ id: result.insertId, debitNumber, party, date, due, amount, unpaid, status });
  } catch (error) {
    console.error("Error creating debit note:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Fetch all debit notes
exports.getAllDebitNotes = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM debit_notes ORDER BY createdAt DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching debit notes:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Fetch single debit note by ID
exports.getDebitNoteById = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM debit_notes WHERE id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Debit note not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching debit note:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
