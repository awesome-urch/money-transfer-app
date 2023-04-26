const Wallet = require("../models/wallet");
const User = require("../models/user");
const {
  BAD_REQUEST,
  UNAUTHORIZED,
  CONFLICT
} = require("../helpers/error_helper");
const BaseController = require("./base_controller");

const INITIAL_TRANSACTION_TYPE = "initial";

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

    props.userId = userId

    const newWallet = await new Wallet().create(props);
    const getWallet = await new Wallet().findOne({id:newWallet[0]});

    return getWallet;
  }

}

  
module.exports = WalletController;
  