const Wallet = require("../models/wallet");
const User = require("../models/user");
const Transaction = require("../models/transaction");
const WalletController = require("./wallet_controller");
const BaseController = require("./base_controller");

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

    let wallet = await new Wallet().findOne({ user_id: props.user_id });
    if(!wallet){
      wallet = new WalletController().initUserWallet({
        user_id: props.user_id
      });
    }

    if(!props.transaction_reference){
      props.transaction_reference = this.generateReference();
      const checkReference = await new Transaction().findOne({ transaction_reference: props.transaction_reference });
      while(checkReference){
        props.transaction_reference = this.generateReference();
      }
    }

    console.log(`amt ${props.amount} wbal ${wallet.balance}`)
    let newBalance;
    if (props.transaction_type === "credit") {
      newBalance = parseFloat(wallet.balance) + parseFloat(props.amount);
    } else if (props.transaction_type === "debit") {

      if(parseFloat(wallet.balance) < parseFloat(props.amount)){
        throw "Insufficient funds"
      }

      newBalance = parseFloat(wallet.balance) - parseFloat(props.amount);
    }
    console.log(`newbal ${JSON.stringify(props)} `);

    props.balance = newBalance;

    const newTransaction = await new Transaction().create(props);
    if(!newTransaction){
      throw "Internal error"
    }
    const getTransaction = await new Transaction().findOne({id:newTransaction[0]});

    console.log(newTransaction);
    console.log(new Transaction().selectableProps);

    await new Wallet().update(wallet.id,{ balance: newBalance, transaction_type: props.transaction_type});

    return getTransaction

  }

  async credit(props){
    props.transaction_type = "credit";
    return this.performTransaction(props);
  }

  async debit(props){
    props.transaction_type = "debit";
    return this.performTransaction(props);
  }
}

  
module.exports = TransactionController;
  