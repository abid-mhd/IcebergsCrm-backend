const db = require("../config/db");

// ✅ Fetch all challans
exports.getAllChallans = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM delivery_challans ORDER BY createdAt DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching challans:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// ✅ Create a challan
exports.createChallan = async (req, res) => {
  try {
    const data = req.body;

    const [result] = await db.execute(
      `INSERT INTO delivery_challans 
      (invoiceNumber, salesDate, dueDate, partyName, items, notes, bankDetails, subtotal, discount, additionalCharges, tcs, total, amountReceived, paymentMode, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        data.invoiceNumber,
        data.salesDate,
        data.dueDate,
        data.party?.name || null,
        JSON.stringify(data.items || []),
        JSON.stringify(data.notes || []),
        JSON.stringify(data.bankDetails || {}),
        data.subtotal || 0,
        data.discount || 0,
        data.additionalCharges || 0,
        data.tcs || 0,
        data.total || 0,
        data.amountReceived || 0,
        data.paymentMode || "Cash",
      ]
    );

    res.json({ message: "Delivery challan created", id: result.insertId });
  } catch (err) {
    console.error("Error creating challan:", err);
    res.status(500).json({ error: "Database error" });
  }
};
