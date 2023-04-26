const BaseModel = require("./base");

class TransferModel extends BaseModel {
  constructor() {
    super("Transfer", "transfers", [
      "id",
      "user_id",
      "receiver_bank_account",
      "amount"
    ]);
  }

}

module.exports = TransferModel;

