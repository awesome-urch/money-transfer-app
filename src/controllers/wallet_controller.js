const Wallet = require("../models/wallet");
const User = require("../models/user");
const APIController = require("./api_controller");
const Transaction = require("../models/transaction");
const TransactionController = require("./transaction_controller");
const {
  BAD_REQUEST,
  UNAUTHORIZED,
  CONFLICT,
  GENERIC_ERROR
} = require("../helpers/error_helper");
const BaseController = require("./base_controller");
const { parse } = require("dotenv");

const INITIAL_TRANSACTION_TYPE = "initial";
const RAVEN_FEE = 10;

class WalletController extends BaseController {

  async createWallet() {
    const props = this.req.body;
    const userId = this.req.user
    props.transaction_type = INITIAL_TRANSACTION_TYPE;

    console.log(this.req.user);

    if (!userId ){
      return this.errorResponse(BAD_REQUEST,"`userId` is required");
    }

    const user = await new User().findOne({ id: userId });
    if(!user) return this.errorResponse(UNAUTHORIZED,"Invalid user");

    const wallet = await new Wallet().findOne({ userId: userId });
    if(wallet) return this.errorResponse(CONFLICT,"User wallet already exists");

    props.user_id = userId

    // const newWallet = await new Wallet().create(props);
    // const getWallet = await new Wallet().findOne({id:newWallet[0]});

    const getWallet = await this.initUserWallet(props);

    return getWallet;
  }

  async initUserWallet(props){
    props.transaction_type = INITIAL_TRANSACTION_TYPE;
    const newWallet = await new Wallet().create(props);
    const getWallet = await new Wallet().findOne({id:newWallet[0]});
    return getWallet;
  }

  async bankTransfer(){
    const props = this.req.body;
    if(!props.amount || !props.bank_code || !props.bank || !props.account_number || !props.account_name || !props.currency ){
      return this.errorResponse(BAD_REQUEST,"`amount`,`bank_code`,`bank`,`account_number`,`account_name` and `currency` are all required");
    }

    if(isNaN(props.amount)){
      return this.errorResponse(BAD_REQUEST,"Invalid amount");
    }

    if(this.checkAmount(props.amount) === false){
      return this.errorResponse(BAD_REQUEST,"amount must be greater than 0");
    }

    props.narration = props.narration ?? "Transfer";

    props.reference = this.generateReference();
    const checkReference = await new Transaction().findOne({ transaction_reference: props.reference });
    while(checkReference){
      props.reference = this.generateReference();
    }

    const userId = this.req.user;

    try{
      const result = await new APIController().bankTransfer(props);
      if(result.data){
        const data = result.data;
        console.log(`${JSON.stringify(data)}`);
        if(result.status == 'success'){
          const totalAmount = parseFloat(props.amount) + parseFloat(RAVEN_FEE);       
          //debit user
          const getTransaction = await new TransactionController().debit({
              user_id: userId,
              amount: totalAmount,
              transaction_reference: data.trx_ref,
              reason: data.narration
          });
          this.res.json({
            ok: true,
            message: `Transfer successful. NGN${totalAmount} was debited from your account`,
            data: getTransaction
          });
        }else{
          return this.errorResponse(BAD_REQUEST,result.message);
        }
      }else{
        return this.errorResponse(GENERIC_ERROR,"Internal error");
      }

    }catch(err){
      return this.errorResponse(BAD_REQUEST,err);
    }

  }


}

  
module.exports = WalletController;
  