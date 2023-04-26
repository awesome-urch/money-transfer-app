
// Simple helper method to create new errors with a specific status value
// attached to them, to match up with the codes and methods below.

class CustomError extends Error {
  constructor(status, message) {
    super(message);

    this.status = status;

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  getErrorMessage() {
    return "Something went wrong: " + this.message;
  }
}

const createError = ({
  status = 500,
  message = "Something went wrong"
}) => {
  const error = new CustomError(status, message);
  return error;
};

const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const CONFLICT = 409;
const NOT_FOUND = 404;
const UNPROCESSABLE = 422;
const GENERIC_ERROR = 500;

module.exports = {
  CustomError,
  createError,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  CONFLICT,
  NOT_FOUND,
  UNPROCESSABLE,
  GENERIC_ERROR,
};
