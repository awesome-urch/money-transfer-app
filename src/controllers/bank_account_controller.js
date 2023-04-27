const Wallet = require("../models/wallet");
const BankAccount = require("../models/bank_account");
const BaseController = require("./base_controller");

class BankAccountController extends BaseController {

  async saveSourceAndDestination(props){
    const bankAccount = await new BankAccount().create(props);
    const getBankAccount = await new Wallet().findOne({id:bankAccount[0]});
    return getBankAccount;
  }

}

  
module.exports = BankAccountController;
  