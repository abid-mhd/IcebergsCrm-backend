const db = require("../config/db");

// ✅ Get all parties
exports.getParties = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM parties ORDER BY createdAt DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching parties:", err);
    res.status(500).json({ message: "Error fetching parties" });
  }
};



// Helper to safely handle undefined values
const safeValue = (val, defaultValue = null) => val === undefined ? defaultValue : val;

// ✅ Create party
exports.createParty = async (req, res) => {
  try {
    const {
      partyName,
      mobile,
      email,
      balance,
      balanceType,
      gstin,
      pan,
      partyType,
      category,
      billingAddress,
      shippingAddress,
      creditPeriodValue,
      creditPeriodUnit,
      creditLimit,
      bankName,
      accountNumber,
      ifsc,
      branch,
    } = req.body;

    // Validate required fields
    if (!partyName || !mobile || !email || !balanceType || !partyType || !category) {
  return res.status(400).json({ message: "Missing required fields" });
}


    const [result] = await db.execute(
      `INSERT INTO parties 
      (partyName, mobile, email, balance, balanceType, gstin, pan, partyType, category, 
       billingAddress, shippingAddress, creditPeriodValue, creditPeriodUnit, creditLimit, 
       bankName, accountNumber, ifsc, branch, createdAt, updatedAt) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        safeValue(partyName),
        safeValue(mobile),
        safeValue(email),
        safeValue(balance, 0),
        safeValue(balanceType),
        safeValue(gstin),
        safeValue(pan),
        safeValue(partyType),
        safeValue(category),
        safeValue(billingAddress),
        safeValue(shippingAddress),
        safeValue(creditPeriodValue),
        safeValue(creditPeriodUnit),
        safeValue(creditLimit),
        safeValue(bankName),
        safeValue(accountNumber),
        safeValue(ifsc),
        safeValue(branch),
      ]
    );

    res.status(201).json({ message: "Party created successfully", id: result.insertId });
  } catch (err) {
    console.error("Error creating party:", err);
    res.status(500).json({ message: "Error creating party", error: err.message });
  }
};


// ✅ Update party
exports.updateParty = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch existing
    const [rows] = await db.execute("SELECT * FROM parties WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Party not found" });

    const {
      partyName,
      mobile,
      email,
      balance,
      balanceType,
      gstin,
      pan,
      partyType,
      category,
      billingAddress,
      shippingAddress,
      creditPeriodValue,
      creditPeriodUnit,
      creditLimit,
      bankName,
      accountNumber,
      ifsc,
      branch,
    } = req.body;

    await db.execute(
      `UPDATE parties 
       SET partyName=?, mobile=?, email=?, balance=?, balanceType=?, gstin=?, pan=?, 
           partyType=?, category=?, billingAddress=?, shippingAddress=?, creditPeriodValue=?, 
           creditPeriodUnit=?, creditLimit=?, bankName=?, accountNumber=?, ifsc=?, branch=?, 
           updatedAt=NOW()
       WHERE id=?`,
      [
        partyName,
        mobile,
        email,
        balance || 0,
        balanceType,
        gstin || null,
        pan || null,
        partyType,
        category,
        billingAddress || null,
        shippingAddress || null,
        creditPeriodValue || null,
        creditPeriodUnit || null,
        creditLimit || null,
        bankName || null,
        accountNumber || null,
        ifsc || null,
        branch || null,
        id,
      ]
    );

    res.json({ message: "Party updated successfully" });
  } catch (err) {
    console.error("Error updating party:", err);
    res.status(500).json({ message: "Error updating party" });
  }
};

// ✅ Delete party
exports.deleteParty = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.execute("SELECT * FROM parties WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Party not found" });

    await db.execute("DELETE FROM parties WHERE id = ?", [id]);

    res.json({ message: "Party deleted successfully" });
  } catch (err) {
    console.error("Error deleting party:", err);
    res.status(500).json({ message: "Error deleting party" });
  }
};
