const Wallet = require("../models/wallet");
const User = require("../models/user");
const Transaction = require("../models/transaction");
const WalletController = require("./wallet_controller");
import {
  createError,
  BAD_REQUEST,
  UNAUTHORIZED,
  CONFLICT,
  UNPROCESSABLE
} from "../helpers/error_helper";
import BaseController from "./base_controller";

class TransactionController extends BaseController {

  async performTransaction(props) {

    if (!props.user_id || !props.amount ){
      throw "`user_id` and `amount` are required params"
    }

    if(isNaN(props.amount)){
      throw "amount is invalid"
    }

    if(this.checkAmount(props.amount) === false){
      throw "amount must be greater than 0"
    }

    const user = await new User().findOne({ id: props.user_id });
    if(!user) {
      throw "Invalid user"
    }

    if(!props.transaction_reference){
      props.transaction_reference = this.generateReference();
      const checkReference = await new Transaction().findOne({ transaction_reference: props.transaction_reference });
      while(checkReference){
        props.transaction_reference = this.generateReference();
      }
    }

    let newBalance;
    if (transactionType === "credit") {
      newBalance = parseFloat(wallet.balance) + parseFloat(props.amount);
    } else if (transactionType === "debit") {

      if(parseFloat(wallet.balance) < parseFloat(props.amount)){
        throw "Insufficient funds"
      }

      newBalance = parseFloat(wallet.balance) - parseFloat(props.amount);
    }

    props.balance = newBalance;
    props.transaction_type = transactionType;

    const newTransaction = await new Transaction().create(props);
    if(!newTransaction){
      throw "An error occurred"
    }
    const getTransaction = await new Transaction().findOne({id:newTransaction[0]});

    console.log(newTransaction);
    console.log(new Transaction().selectableProps);

    await new Wallet().update(wallet.id,{ balance: newBalance, transaction_type: transactionType});

    return getTransaction

  }

  async credit(){
    this.performTransaction("credit");
  }

  async debit(){
    this.performTransaction("debit");
  }
}

  
export default TransactionController;
  