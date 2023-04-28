const User = require("../models/user");
const BaseController = require("./base_controller");

class UserController extends BaseController {
  
  async getUser(){
    const user = await new User().findOne({id:this.req.user});
    return this.successResponse("",user);
  }

}

  
module.exports = UserController;
  