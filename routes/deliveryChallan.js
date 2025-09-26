const express = require("express");
const router = express.Router();
const deliveryController = require("../controllers/deliveryController");

router.get("/", deliveryController.getAllChallans);

router.post("/", deliveryController.createChallan);

module.exports = router;
