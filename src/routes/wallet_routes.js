const express = require("express");
const WalletController = require("../controllers/wallet_controller");
const GeneratedBankAccountController = require("../controllers/generated_bank_account_controller");

const router = express.Router();

router.post("/generate_bank_account", (req, res, next) => {
  const controller = new GeneratedBankAccountController(req, res, next);
  controller.createBankAccount();
});

module.exports = {router};