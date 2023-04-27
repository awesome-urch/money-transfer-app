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

    const wallet = await new Wallet().findOne({ user_id: props.user_id });

    if(!props.transaction_reference){
      props.transaction_reference = this.generateReference();
      const checkReference = await new Transaction().findOne({ transaction_reference: props.transaction_reference });
      while(checkReference){
        props.transaction_reference = this.generateReference();
      }
    }

    let newBalance;
    if (props.transaction_type === "credit") {
      newBalance = parseFloat(wallet.balance) + parseFloat(props.amount);
    } else if (props.transaction_type === "debit") {

      if(parseFloat(wallet.balance) < parseFloat(props.amount)){
        throw "Insufficient funds"
      }

      newBalance = parseFloat(wallet.balance) - parseFloat(props.amount);
    }

    props.balance = newBalance;

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

  async credit(props){
    props.transaction_type = "credit";
    this.performTransaction(props);
  }

  async debit(props){
    props.transaction_type = "debit";
    this.performTransaction(props);
  }
}

  
export default TransactionController;
  