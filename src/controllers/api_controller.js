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

class APIController extends BaseController {
  
  async generateBankAccount(props) {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    try {
      const response = await axios.post('https://integrations.getravenbank.com/v1/pwbt/generate_account', props, config);
      console.log(`data is ${response.data}`);
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
      const response = await axios.post('https://integrations.getravenbank.com/v1/webhooks/update', props, config);
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
  