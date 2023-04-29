const BaseController = require("./base_controller");
const TransactionController = require("./transaction_controller");
const BankAccountController = require("./bank_account_controller");
const GeneratedBankAccount = require("../models/generated_bank_account");
const { TRANSACTION_FEE } = require("../helpers/constants");
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
        return this.res.status(400).send(`Invalid secret key`);
      }
      if (type == COLLECTION) {
        //get user_id using account number param
        const getBankAccount = await new GeneratedBankAccount().findOne({account_number:event.account_number});
        if (getBankAccount) {
          try {
            //save source account
            const sourceAccount = await new BankAccountController().saveSourceAndDestination({
              bank: event.source.bank,
              bank_code: event.source.bank_code,
              account_number: event.source.account_number,
              account_name: `${event.source.first_name} ${event.source.last_name}`
            });
            await new TransactionController().credit({
              user_id: getBankAccount.user_id,
              amount: event.amount,
              transaction_reference: event.session_id,
              reason: event.source.narration,
              status: "success",
              source: sourceAccount.id
            })
            return  this.res.status(200).end();
          } catch (err) {
            console.error(err);
            return this.res.status(500).send('Internal server error');
          }
        } else {
          return this.res.status(400).send(`Invalid`);
        }
      }
      if (type == TRANSFER) {
        const transaction = await new TransactionController().getTransaction({
          transaction_reference: event.trx_ref
        });
        if(!transaction){
          return this.res.status(400).send(`Invalid transaction reference`);
        }
        if(transaction.status == "success"){
          return this.res.status(200).end();
        }//successful
        if(event.status == "successful"){
          await new TransactionController().updateTransaction(transaction.id,{
            status: "success"
          });
          return  this.res.status(200).end();
        }else if(event.status == "failed"){
          await new TransactionController().updateTransaction(transaction.id,{
            status: "failed"
          });
          //reverse the amount to user's account
          const totalReversalAmount = parseFloat(event.meta.amount) + parseFloat(TRANSACTION_FEE);
          const transactionReference = new TransactionController().generateReference();
          await new TransactionController().credit({
            user_id: transaction.user_id,
            amount: totalReversalAmount,
            transaction_reference: transactionReference,
            status: "success",
            reason: `Reversal for transaction ref: ${event.trx_ref}`
          })
          return  this.res.status(200).end();
        }else{
          return this.res.status(400).send(`Invalid transaction status`);
        }
      }
    } catch (err) {
      console.error(err);
      return this.res.status(500).send('Internal server error');
    }
  }

}

  
module.exports = WebhookController;
  