const BaseController = require("./base_controller");
const TransactionController = require("./transaction_controller");
const GeneratedBankAccount = require("../models/generated_bank_account");
const dotenv = require("dotenv");
dotenv.config();

const COLLECTION = "collection";
const TRANSFER = "transfer";


class WebhookController extends BaseController {

  async getPayload(){
    const event = this.req.body;
    const type = event.type;

    if(event.secret !== process.env.RAVEN_WEBHOOK_SECRET){
      res.status(400).send(`Invalid`);
    }

    if(type==COLLECTION){
      //get user using account number param
      const getBankAccount = await new GeneratedBankAccount().findOne({account_number:event.account_number});
      if(getBankAccount){
        const creditUser = await new TransactionController()
        getBankAccount.user_id
      }else{
        res.status(400).send(`Invalid`);
      }
    }

  }

}

  
module.exports = WebhookController;
  