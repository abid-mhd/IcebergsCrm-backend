const { models } = require('../models');

exports.list = async (req, res) => {
  const clients = await models.Client.findAll();
  res.json(clients);
};

exports.create = async (req, res) => {
  const client = await models.Client.create(req.body);
  res.status(201).json(client);
};

exports.get = async (req, res) => {
  const client = await models.Client.findByPk(req.params.id);
  if (!client) return res.status(404).json({ message: 'Not found' });
  res.json(client);
};

exports.update = async (req, res) => {
  const client = await models.Client.findByPk(req.params.id);
  if (!client) return res.status(404).json({ message: 'Not found' });
  await client.update(req.body);
  res.json(client);
};

exports.remove = async (req, res) => {
  const client = await models.Client.findByPk(req.params.id);
  if (!client) return res.status(404).json({ message: 'Not found' });
  await client.destroy();
  res.json({ message: 'Deleted' });
};
