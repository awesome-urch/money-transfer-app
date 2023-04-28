const express = require("express");
const UserController = require("../controllers/user_controller");

const router = express.Router();

router.get("/user/get", (req, res, next) => {
  const controller = new UserController(req, res, next);
  controller.getUser();
});

module.exports = {router};