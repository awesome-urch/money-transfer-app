const BaseModel = require("./base");

class WalletModel extends BaseModel {
  constructor() {
    super("Wallet", "wallets", [
      "id",
      "user_id",
      "balance"
    ]);
  }

}

module.exports = WalletModel;

