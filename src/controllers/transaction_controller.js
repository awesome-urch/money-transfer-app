const Wallet = require("../models/wallet");
const User = require("../models/user");
const Transaction = require("../models/transaction");
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
      return this.next(createError({
        status: BAD_REQUEST,
        message: "`user_id` and `amount` are required"
      }));
    }

    if(isNaN(props.amount)){
      return this.next(createError({
        status: BAD_REQUEST,
        message: "`amount` is invalid"
      }));
    }

    if(this.checkAmount(props.amount) === false){
      return this.next(createError({
        status: BAD_REQUEST,
        message: "`amount` must be greater than 0"
      }));
    }

    const user = await new User().findOne({ id: props.user_id });
    if(!user) return this.next(createError({
      status: UNAUTHORIZED,
      message: "Invalid user"
    }));

    const wallet = await new Wallet().findOne({ user_id: props.user_id });
    if(!wallet) return this.next(createError({
      status: CONFLICT,
      message: "User has not created wallet account"
    }));

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
        return this.next(createError({
          status: UNPROCESSABLE,
          message: "Insufficient funds"
        }));
      }

      newBalance = parseFloat(wallet.balance) - parseFloat(props.amount);
    }

    props.balance = newBalance;
    props.transaction_type = transactionType;

    const newTransaction = await new Transaction().create(props);
    if(!newTransaction){
      return this.next(createError({
        status: UNPROCESSABLE,
        message: "An error occurred"
      }));
    }
    const getTransaction = await new Transaction().findOne({id:newTransaction[0]});

    console.log(newTransaction);
    console.log(new Transaction().selectableProps);

    await new Wallet().update(wallet.id,{ balance: newBalance, transaction_type: transactionType});

    this.res.json({
      ok: true,
      message: "Wallet " + transactionType + "ed successfully",
      transaction: getTransaction
    });
  }

  async credit(){
    this.performTransaction("credit");
  }

  async debit(){
    this.performTransaction("debit");
  }
}

  
export default TransactionController;
  