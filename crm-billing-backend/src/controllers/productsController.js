const { models } = require('../models');

exports.list = async (req, res) => {
  const products = await models.Product.findAll();
  res.json(products);
};

exports.create = async (req, res) => {
  const product = await models.Product.create(req.body);
  res.status(201).json(product);
};

exports.get = async (req, res) => {
  const product = await models.Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
};

exports.update = async (req, res) => {
  const product = await models.Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  await product.update(req.body);
  res.json(product);
};

exports.remove = async (req, res) => {
  const product = await models.Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  await product.destroy();
  res.json({ message: 'Deleted' });
};
