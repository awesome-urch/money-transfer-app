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
      return response.data;
    } catch (error) {
      console.error('API call error:', error);
      throw "API call error occurred";
    }
  }
}

  
module.exports = APIController;
  