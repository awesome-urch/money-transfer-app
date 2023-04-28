const express = require("express");
const WalletController = require("../controllers/wallet_controller");
const GeneratedBankAccountController = require("../controllers/generated_bank_account_controller");

const router = express.Router();

router.get("/bank_account", (req, res, next) => {
  const controller = new GeneratedBankAccountController(req, res, next);
  controller.createBankAccount();
});

router.post("/bank_transfer", (req, res, next) => {
  const controller = new WalletController(req, res, next);
  controller.bankTransfer();
});

module.exports = {router};