const BaseModel = require("./base");

class AccessTokenModel extends BaseModel {
  constructor() {
    super("AccessToken", "access_tokens", [
      "id",
      "user_id",
      "access_token",
      "access_token_expires"
    ]);
  }

  async getAccessToken(token) {
    return await this.findOne({access_token:token});
  }

}

module.exports = AccessTokenModel;
