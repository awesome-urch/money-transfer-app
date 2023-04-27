const express = require("express");
const APIController = require("../controllers/api_controller");

const router = express.Router();

router.post("/webhook/update", (req, res, next) => {
  const controller = new APIController(req, res, next);
  controller.updateWebhookDetails();
});

module.exports = {router};