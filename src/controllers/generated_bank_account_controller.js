const Wallet = require("../models/wallet");
const User = require("../models/user");
const GeneratedBankAccount = require("../models/generated_bank_account");
const APIController = require("./api_controller");
const WalletController = require("./wallet_controller");

const {
  BAD_REQUEST,
  UNAUTHORIZED,
  CONFLICT
} = require("../helpers/error_helper");
const BaseController = require("./base_controller");
const dotenv = require("dotenv");
dotenv.config();
const axios = require('axios');
const token = process.env.RAVEN_LIVE_SECRET;
const config = {
  headers: { Authorization: `Bearer ${token}` }
};

class GeneratedBankAccountController extends BaseController {
  
  async createBankAccount(){
    const userId = this.req.user;
    const user = await new User().findOne({id:userId});
    const bankAccount = await new GeneratedBankAccount().findOne({ user_id: userId });
    
    if(bankAccount){
      return this.successResponse('Bank account generated successfully',bankAccount);
    }

    try{
      const postData = {
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        amount: '0',
        email: user.email
      }
      const result = await new APIController().generateBankAccount(postData);
      if(result.data){
        const data = result.data;
        const props = {
          user_id: userId,
          bank: data.bank,
          account_number: data.account_number,
          account_name: data.account_name
        };
        await new GeneratedBankAccount().create(
          {
            user_id: userId,
            bank: data.bank,
            account_number: data.account_number,
            account_name: data.account_name
          }
        );
        //create user wallet account
        await new WalletController().initUserWallet({
          user_id: userId
        });
        const bankAccount = await new GeneratedBankAccount().findOne({ user_id: userId });
        this.successResponse('Bank account generated successfully',bankAccount);
      }else{
        this.errorResponse(GENERIC_ERROR,"");
      }

    }catch(err){
      this.errorResponse(BAD_REQUEST,err);
    }
  }


}

  
module.exports = GeneratedBankAccountController;
  