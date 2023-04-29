const User = require("../models/user");
const AccessTokenModel = require("../models/access_token");
const { BAD_REQUEST, UNAUTHORIZED, CONFLICT } = require("../helpers/error_helper");
const BaseController = require("./base_controller");
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

class AuthController extends BaseController {

  constructor(req, res, next) {
    super(req, res, next);
    this.tokenExpireDays = 1;
    this.accessToken = "";
    this.page = "login";
  }

  authenticationSuccessful(message, user) {
    return this.successResponse(message,{ user: user, token: this.accessToken });
  }

  async generateToken(userId) {
    const currentDate = new Date();
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + this.tokenExpireDays);
  
    const token = jwt.sign({ user_id: userId }, process.env.JWT_SECRET, { expiresIn: this.tokenExpireDays + 'd' });
  
    const accessToken = await new AccessTokenModel().create({
      user_id: userId,
      access_token: token,
      access_token_expires: nextDate
    });
  
    return await new AccessTokenModel().findOne({ id: accessToken[0] });
  }

  async postLogin() {
    this.page = "login";

    if (!this.req.body.email || !this.req.body.password) this.errorResponse(BAD_REQUEST,"`email` and `password` are required fields");

    const email = String(this.req.body.email);
    const password = String(this.req.body.password);
    try {
      const users = await new User().verify(email, password);
      if (users) {
        const user = users[0];
        const getAccessToken = await this.generateToken(user.id);
        this.accessToken = getAccessToken.access_token;

        this.authenticationSuccessful("Login successful", user);
      } else {
        this.errorResponse(UNAUTHORIZED, "");
      }
    } catch (err) {
      return this.errorResponse(UNAUTHORIZED, err);
    }
  }

  async postRegister() {
    this.page = "register";
    const props = this.req.body;

    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!emailRegexp.test(props.email)) {
      return this.errorResponse(
        BAD_REQUEST,
        "Email address is not valid");
    }

    if (!props.email || !props.password || !props.first_name || !props.last_name || !props.phone ) {
      return this.errorResponse(
        BAD_REQUEST,
        "`email`, `password`, `first_name`, `last_name` and `phone` are all required fields");
    }

    const user = await new User().findOne({ email: props.email });

    if (user) {
      return this.errorResponse(
        CONFLICT,
        "Email already exists"
      );
    }

    const user1 = await new User().findOne({ username: props.username });

    if (user1) {
      return this.errorResponse(
        CONFLICT,
        "Username already exists"
      );
    }

    const newUser = await new User().create({
      email: props.email,
      first_name: props.first_name,
      last_name: props.last_name,
      phone: props.phone,
      password: props.password,
      username: props.username
    });

    const getUser = await new User().findOne({id:newUser[0]});
    const getAccessToken = await this.generateToken(getUser.id);
    this.accessToken = getAccessToken.access_token;
    this.authenticationSuccessful("Registration successful",getUser);
  }
}

module.exports = AuthController;