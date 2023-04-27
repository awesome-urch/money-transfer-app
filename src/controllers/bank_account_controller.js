const BankAccount = require("../models/bank_account");
const BaseController = require("./base_controller");

class BankAccountController extends BaseController {

  async saveSourceAndDestination(props){
    const checkBankAccount = await new BankAccount().findOne({
      bank: props.bank,
      account_number: props.account_number
    });
    if(checkBankAccount){
      return checkBankAccount;
    }
    const bankAccount = await new BankAccount().create(props);
    const getBankAccount = await new BankAccount().findOne({id:bankAccount[0]});
    return getBankAccount;
  }

}

  
module.exports = BankAccountController;
  