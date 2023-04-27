const BaseController = require("./base_controller");

const COLLECTION = "collection";
const TRANSFER = "transfer";


class WebhookController extends BaseController {

  async getPayload(){
    const event = this.req.body;
    const type = event.type;
    if(type==COLLECTION){

    }

  }

}

  
module.exports = WebhookController;
  