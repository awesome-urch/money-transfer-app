const express = require("express");
const AuthController = require("../controllers/auth_controller");

const router = express.Router();

router.post("/login", (req, res, next) => {
  const controller = new AuthController(req, res, next);
  controller.postLogin();
});

router.post("/register", (req, res, next) => {
  const controller = new AuthController(req, res, next);
  controller.postRegister();
});
  
module.exports = {router};