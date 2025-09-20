const { sequelize, models } = require('../models');
const { Op } = require('sequelize');

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
  return { computedItems, subTotal: +subTotal.toFixed(2), tax: taxVal, discount: discountVal, total };
}

exports.list = async (req, res) => {
  const invoices = await models.Invoice.findAll({
    include: [{ model: models.Client }, { model: models.InvoiceItem }]
  });
  res.json(invoices);
};

exports.get = async (req, res) => {
  const invoice = await models.Invoice.findByPk(req.params.id, {
    include: [{ model: models.Client }, { model: models.InvoiceItem }]
  });
  if (!invoice) return res.status(404).json({ message: 'Not found' });
  res.json(invoice);
};

// Create invoice and items in transaction
exports.create = async (req, res) => {
  const payload = req.body;
  
  const t = await sequelize.transaction();
  try {
    const { computedItems, subTotal, tax, discount, total } = calcAmounts(payload.items || [], payload.tax || 0, payload.discount || 0);

    const invoice = await models.Invoice.create({
      invoiceNumber: payload.invoiceNumber,
      date: payload.date,
      dueDate: payload.dueDate,
      clientId: payload.clientId,
      status: payload.status || 'draft',
      subTotal,
      tax,
      discount,
      total,
      notes: payload.notes
    }, { transaction: t });

    for (const it of computedItems) {
      await models.InvoiceItem.create({
        invoiceId: invoice.id,
        productId: it.productId,
        description: it.description,
        quantity: it.quantity,
        rate: it.rate,
        amount: it.amount
      }, { transaction: t });


    }

    await t.commit();
    const created = await models.Invoice.findByPk(invoice.id, { include: [models.InvoiceItem, models.Client] });
    res.status(201).json(created);
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: 'Error creating invoice', error: err.message });
  }
};

exports.update = async (req, res) => {
  // Simple update (does not replace items). For full update replace items logic could be added.
  const invoice = await models.Invoice.findByPk(req.params.id);
  if (!invoice) return res.status(404).json({ message: 'Not found' });
  await invoice.update(req.body);
  res.json(invoice);
};

exports.delete = async (req, res) => {
  const invoice = await models.Invoice.findByPk(req.params.id);
  if (!invoice) return res.status(404).json({ message: 'Not found' });
  await invoice.destroy();
  res.json({ message: 'Deleted' });
};

// endpoint to mark payment / calculate balance
exports.balance = async (req, res) => {
  const invoiceId = req.params.id;
  const invoice = await models.Invoice.findByPk(invoiceId, { include: [models.InvoiceItem, models.Payment] });
  if (!invoice) return res.status(404).json({ message: 'Not found' });

  const paid = invoice.Payments ? invoice.Payments.reduce((s, p) => s + parseFloat(p.amount), 0) : 0;
  const balance = +(parseFloat(invoice.total) - paid).toFixed(2);
  res.json({ invoiceId, total: invoice.total, paid: +paid.toFixed(2), balance });
};
