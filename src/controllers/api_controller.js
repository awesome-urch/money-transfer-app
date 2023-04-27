const Wallet = require("../models/wallet");
const User = require("../models/user");
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
const endpoint = 'https://integrations.getravenbank.com';

class APIController extends BaseController {
  
  async generateBankAccount(props) {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    try {
      const response = await axios.post(`${endpoint}/v1/pwbt/generate_account`, props, config);
      console.log(`data is ${response.data}`);
      return response.data;
    } catch (error) {
      console.error('API call error:', error);
      throw "API call error occurred";
    }
  }

  async bankTransfer(props) {

    const test = {
      "status": "success",
      "message": "transfer queued successfully",
      "data": {
        "email": "nnabugwu.michael@gmail.com",
        "trx_ref": "202304271440GBIHFCE",
        "merchant_ref": "REF001",
        "amount": 1,
        "bank": "Access Bank",
        "bank_code": "044",
        "account_number": "0727910558",
        "account_name": "Nnabugwu Uchechukwu Michael",
        "narration": "Sent from Raven",
        "gateway": 1,
        "fee": 10,
        "status": "pending",
        "created_at": "2023-04-27T13:40:27.386Z",
        "id": 101176
      }
    }

    return test;

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    try {
      const response = await axios.post(`${endpoint}/v1/transfers/create`, props, config);
      console.log(`data is ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      console.error('API call error:', error);
      throw "API call error occurred";
    }
  }

  async updateWebhookDetails() {
    const props = this.req.body
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    try {
      const response = await axios.post(`${endpoint}/v1/webhooks/update`, props, config);
      this.res.json({
        ok: true,
        message: 'Webhook details updated successfully',
        data: response.data.data
      });

    } catch (error) {
      console.error('API call error:', error);
      this.errorResponse(GENERIC_ERROR,"");
    }
  }




}

  
module.exports = APIController;
  