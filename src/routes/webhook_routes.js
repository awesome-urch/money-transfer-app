const express = require("express");
const WebhookController = require("../controllers/webhook_controller");

const router = express.Router();

router.post("/generate_bank_account", (req, res, next) => {
  const controller = new WebhookController(req, res, next);
  controller.processPayload();
});

module.exports = {router};