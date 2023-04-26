const BaseModel = require("./base");

class GeneratedBankAccountModel extends BaseModel {
  constructor() {
    super("GeneratedBankAccount", "generated_bank_accounts", [
      "id",
      "user_id",
      "bank",
      "account_number",
      "account_name"
    ]);
  }

}

module.exports = GeneratedBankAccountModel;

