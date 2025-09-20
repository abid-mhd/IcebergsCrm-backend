const { models } = require("../models");

exports.getParties = async (req, res) => {
  try {
    const parties = await models.Party.findAll();
    res.json(parties);
  } catch (err) {
    res.status(500).json({ message: "Error fetching parties", error: err.message });
  }
};

exports.createParty = async (req, res) => {
  try {
    const party = await models.Party.create(req.body);
    res.status(201).json(party);
  } catch (err) {
    res.status(500).json({ message: "Error creating party", error: err.message });
  }
};

exports.updateParty = async (req, res) => {
  try {
    const { id } = req.params;
    await models.Party.update(req.body, { where: { id } });
    const updated = await models.Party.findByPk(id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating party", error: err.message });
  }
};

exports.deleteParty = async (req, res) => {
  try {
    const { id } = req.params;
    await models.Party.destroy({ where: { id } });
    res.json({ message: "Party deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting party", error: err.message });
  }
};
