const express = require("express");
const router = express.Router();
const paymentOutController = require("../controllers/paymentOutController");

router.get("/", paymentOutController.getAllPaymentsOut);
router.post("/", paymentOutController.createPaymentOut);
router.delete("/:id", paymentOutController.deletePaymentOut);

module.exports = router;
