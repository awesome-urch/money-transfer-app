const Wallet = require("../models/wallet");
const User = require("../models/user");
const Transaction = require("../models/transaction");
const WalletController = require("./wallet_controller");
const BaseController = require("./base_controller");
const { knexDb } = require("../config/database");

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
      wallet = await new WalletController().initUserWallet({
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
      throw "Internal error"
    }
    const getTransaction = await new Transaction().findOne({id:newTransaction[0]});
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

  async getTransaction(props){
    const transaction = await new Transaction().findOne({
      transaction_reference: props.transaction_reference,
    });
    return transaction;
  }

  async updateTransaction(id, props){
    await new Transaction().update(id,{status:props.status});
  }

  async getTransactions(transactionType){
    const limit = 10;
    const props = this.req.query;
    let page = Number(props.page) || 1;
    if (page < 1 || !Number.isInteger(page)) {
      page = 1;
    }
    const offset = limit * (page - 1);
    let params = {user_id: this.req.user};
    if(transactionType){
      params.transaction_type = transactionType;
    }

    let transactions;
    if(transactionType == 'debit'){
      transactions = await knexDb('transactions')
      .from('transactions')
      .select('transactions.*', knexDb.raw('JSON_OBJECT("bank", bank_accounts.bank, "bank_code", bank_accounts.bank_code, "account_number", bank_accounts.account_number, "account_name", bank_accounts.account_name) as destination'))
      .leftJoin('bank_accounts', 'transactions.destination', '=', 'bank_accounts.id')
      .where(params)
      .orderBy('transactions.id', 'desc')
      .offset(offset)
      .limit(limit);
    }else if(transactionType == 'credit'){
      transactions = await knexDb('transactions')
      .from('transactions')
      .select('transactions.*', knexDb.raw('JSON_OBJECT("bank", bank_accounts.bank, "bank_code", bank_accounts.bank_code, "account_number", bank_accounts.account_number, "account_name", bank_accounts.account_name) as source'))
      .leftJoin('bank_accounts', 'transactions.source', '=', 'bank_accounts.id')
      .where(params)
      .orderBy('transactions.id', 'desc')
      .offset(offset)
      .limit(limit);
    }else{
      transactions = await knexDb('transactions')
      .from('transactions')
      .select(
        'transactions.*',
        knexDb.raw('JSON_OBJECT("bank", bank_accounts.bank, "bank_code", bank_accounts.bank_code, "account_number", bank_accounts.account_number, "account_name", bank_accounts.account_name) as source'),
        knexDb.raw('JSON_OBJECT("bank", dest_accounts.bank, "bank_code", dest_accounts.bank_code, "account_number", dest_accounts.account_number, "account_name", dest_accounts.account_name) as destination')
      )
      .leftJoin('bank_accounts', 'transactions.source', '=', 'bank_accounts.id')
      .leftJoin('bank_accounts as dest_accounts', 'transactions.destination', '=', 'dest_accounts.id')
      .where(params)
      .orderBy('transactions.id', 'desc')
      .offset(offset)
      .limit(limit);
    }

    return this.successResponse("",transactions);
  }

  async getTransfers(){
    await this.getTransactions("debit");
  }

  async getDeposits(){
    await this.getTransactions("credit");
  }

}

  
module.exports = TransactionController;