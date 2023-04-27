const BaseModel = require("./base");

class TransactionModel extends BaseModel {
  constructor() {
    super("Transaction", "transactions", [
      "id",
      "user_id",
      "amount",
      "balance",
      "transaction_type",
      "transaction_reference",
      "reason"
    ]);
  }
}

module.exports = TransactionModel;

