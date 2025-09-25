const db = require("../config/db");

// --- Utility function to calculate totals ---
function calcAmounts(items, tax = 0, discount = 0) {
  let subTotal = 0;
  const computedItems = items.map(it => {
    const q = parseFloat(it.quantity) || 0;
    const r = parseFloat(it.rate) || 0;
    const amt = +(q * r).toFixed(2);
    subTotal += amt;
    return { ...it, quantity: q, rate: r, amount: amt };
  });

  const taxVal = parseFloat(tax) || 0;
  const discountVal = parseFloat(discount) || 0;
  const total = +(subTotal + taxVal - discountVal).toFixed(2);

  return {
    computedItems,
    subTotal: +subTotal.toFixed(2),
    tax: taxVal,
    discount: discountVal,
    total
  };
}

// ✅ List all invoices with client + items
exports.list = async (req, res) => {
  try {
    const [invoices] = await db.execute(`
      SELECT i.*, c.name as clientName
      FROM invoices i
      LEFT JOIN clients c ON i.clientId = c.id
      ORDER BY i.createdAt DESC
    `);

    for (const inv of invoices) {
      const [items] = await db.execute(
        "SELECT * FROM invoice_items WHERE invoiceId = ?",
        [inv.id]
      );
      inv.items = items;
    }

    res.json(invoices);
  } catch (err) {
    console.error("Error fetching invoices:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// ✅ Get single invoice by ID
exports.get = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM invoices WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: "Not found" });

    const invoice = rows[0];

    const [client] = await db.execute(
      "SELECT * FROM clients WHERE id = ?",
      [invoice.clientId]
    );
    invoice.client = client[0] || null;

    const [items] = await db.execute(
      "SELECT * FROM invoice_items WHERE invoiceId = ?",
      [invoice.id]
    );
    invoice.items = items;

    res.json(invoice);
  } catch (err) {
    console.error("Error fetching invoice:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// ✅ Create invoice with items
exports.create = async (req, res) => {
  const payload = req.body;
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const { computedItems, subTotal, tax, discount, total } = calcAmounts(
      payload.items || [],
      payload.tax || 0,
      payload.discount || 0
    );

    const [result] = await conn.execute(
      `INSERT INTO invoices 
      (invoiceNumber, date, dueDate, clientId, status, subTotal, tax, discount, total, notes, createdAt, updatedAt) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        payload.invoiceNumber,
        payload.date,
        payload.dueDate,
        payload.clientId,
        payload.status || "draft",
        subTotal,
        tax,
        discount,
        total,
        payload.notes || null,
      ]
    );

    const invoiceId = result.insertId;

    for (const it of computedItems) {
      await conn.execute(
        `INSERT INTO invoice_items (invoiceId, productId, description, quantity, rate, amount) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [invoiceId, it.productId, it.description, it.quantity, it.rate, it.amount]
      );
    }

    await conn.commit();

    res.status(201).json({ message: "Invoice created", id: invoiceId });
  } catch (err) {
    await conn.rollback();
    console.error("Error creating invoice:", err);
    res.status(500).json({ message: "Error creating invoice" });
  } finally {
    conn.release();
  }
};

// ✅ Update invoice
exports.update = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM invoices WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Not found" });

    await db.execute(
      `UPDATE invoices SET invoiceNumber=?, date=?, dueDate=?, clientId=?, status=?, notes=?, updatedAt=NOW() WHERE id=?`,
      [
        req.body.invoiceNumber,
        req.body.date,
        req.body.dueDate,
        req.body.clientId,
        req.body.status,
        req.body.notes,
        req.params.id,
      ]
    );

    res.json({ message: "Invoice updated" });
  } catch (err) {
    console.error("Error updating invoice:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// ✅ Delete invoice
exports.delete = async (req, res) => {
  try {
    await db.execute("DELETE FROM invoice_items WHERE invoiceId = ?", [req.params.id]);
    const [result] = await db.execute("DELETE FROM invoices WHERE id = ?", [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Error deleting invoice:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// ✅ Get balance (paid vs unpaid)
exports.balance = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM invoices WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Not found" });

    const invoice = rows[0];

    const [payments] = await db.execute("SELECT * FROM payments WHERE invoiceId = ?", [invoice.id]);
    const paid = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);

    const balance = +(parseFloat(invoice.total) - paid).toFixed(2);

    res.json({ invoiceId: invoice.id, total: invoice.total, paid: +paid.toFixed(2), balance });
  } catch (err) {
    console.error("Error calculating balance:", err);
    res.status(500).json({ message: "Database error" });
  }
};
