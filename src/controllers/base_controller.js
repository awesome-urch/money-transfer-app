const User = require("../models/user");

const { createError, UNAUTHORIZED } = require("../helpers/error_helper");

class BaseController {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
  }

  errorResponse(code, error){
    this.res.status(code).send({
      ok: false,
      message: error,
    });
  }

  balanceIsMoreThanAmount(balance, amount) {
    if (balance <= amount) {
      return false;
    }
    return true;
  }

  checkAmount(amount) {
    return !(amount <= 0);
  }

  generateReference() {
    return (Math.random() + 1).toString(36).substring(2);
  }

  async checkUser() {
    const user = await new User().findOne({ id: this.req.body.user_id });
    if (!user) {
      return this.next(
        createError({
          status: UNAUTHORIZED,
          message: "Invalid user",
        })
      );
    }

    return user;
  }
}

module.exports = BaseController;
