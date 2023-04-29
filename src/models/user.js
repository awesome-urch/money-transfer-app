const { hash: _hash, compare } = require("bcrypt");
const BaseModel = require("./base");

const SALT_ROUNDS = 10;
const hashPassword = (password) => _hash(password, SALT_ROUNDS);
const verifyPassword = (password, hash) => compare(password, hash);

class UserModel extends BaseModel {
  constructor() {
    super("User", "users", [
      "id",
      "username",
      "email",
      "first_name",
      "last_name",
      "phone"
    ]);
  }

  beforeSave(data) {
    if (!data.password) return Promise.resolve(data);
    return hashPassword(data.password)
      .then((hash) => ({ ...data, password: hash }))
      .catch((err) => `Error hashing password: ${err}`);
  }

  async create(props) {
    const user = await this.beforeSave(props);
    delete props.id; // not allowed to set `id`
    return this.knexInstance
      .insert(user)
      .returning("*")
      .timeout(this.timeout);
  }

  async verify(email, password) {
    const matchErrorMsg = "Invalid login credentials";
    const user = await this.knexInstance
      .select()
      .from(this.tableName)
      .where({ email })
      .timeout(this.timeout);

    if (!user.length) throw matchErrorMsg;

    const [isMatch] = await Promise.all([
      verifyPassword(password, user[0].password)
    ]);

    if (!isMatch) throw matchErrorMsg;
    delete user[0].password;

    return user;
  }
}

module.exports = UserModel;
