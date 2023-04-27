const express = require("express");
const WebhookController = require("../controllers/webhook_controller");

const router = express.Router();

router.post("/webhook/process", (req, res, next) => {
  const controller = new WebhookController(req, res, next);
  controller.processPayload();
});

module.exports = {router};