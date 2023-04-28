class BaseController {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
  }

  successResponse(message, data){
    this.res.json({
      ok: true,
      message: message,
      data: data
    });
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

}

module.exports = BaseController;
