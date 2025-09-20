const { models } = require('../models');

exports.create = async (req, res) => {
  // payload: { invoiceId, date, amount, method, reference }
  const p = await models.Payment.create(req.body);
  // Optionally update invoice status
  const invoice = await models.Invoice.findByPk(p.invoiceId, { include: [models.Payment] });
  const paid = invoice.Payments.reduce((s, pay) => s + parseFloat(pay.amount), 0);
  let status = invoice.status;
  if (paid >= parseFloat(invoice.total)) status = 'paid';
  else if (paid > 0) status = 'partial';
  await invoice.update({ status });
  res.status(201).json(p);
};

exports.list = async (req, res) => {
  const payments = await models.Payment.findAll();
  res.json(payments);
};
