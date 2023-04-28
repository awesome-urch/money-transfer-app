const express = require("express");
const TransactionController = require("../controllers/transaction_controller");

const router = express.Router();

router.get("/transaction/history", (req, res, next) => {
  const controller = new TransactionController(req, res, next);
  controller.getTransactions();
});

router.get("/deposit/history", (req, res, next) => {
  const controller = new TransactionController(req, res, next);
  controller.getDeposits();
});

router.get("/transfer/history", (req, res, next) => {
  const controller = new TransactionController(req, res, next);
  controller.getTransfers();
});

module.exports = {router};