const BaseModel = require("./base");

class BankAccountModel extends BaseModel {
  constructor() {
    super("BankAccount", "bank_accounts", [
      "id",
      "bank",
      "bank_code",
      "account_number",
      "account_name"
    ]);
  }

}

module.exports = BankAccountModel;

