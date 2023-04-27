const BaseController = require("./base_controller");
const TransactionController = require("./transaction_controller");
const GeneratedBankAccount = require("../models/generated_bank_account");
const BankAccount = require("../models/bank_account");
const dotenv = require("dotenv");
dotenv.config();

const COLLECTION = "collection";
const TRANSFER = "transfer";


class WebhookController extends BaseController {

  async processPayload(){
    try {
      const event = this.req.body;
      const type = event.type;
      if (event.secret !== process.env.RAVEN_WEBHOOK_SECRET) {
        res.status(400).send(`Invalid secret key`);
      }
      if (type == COLLECTION) {
        //get user_id using account number param
        const getBankAccount = await new GeneratedBankAccount().findOne({account_number:event.account_number});
        if (getBankAccount) {
          try {
            await new TransactionController().creditUser({
              user_id: getBankAccount.user_id,
              amount: event.amount,
              transaction_reference: event.session_id
            })
            res.status(200).end();
          } catch (err) {
            console.error(err);
            res.status(500).send('Internal server error');
          }
        } else {
          res.status(400).send(`Invalid`);
        }
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  }

}

  
module.exports = WebhookController;
  