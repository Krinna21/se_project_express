const ERROR_NOT_FOUND = 404;
const ERROR_INTERNAL_SERVER = 500;
const ERROR_BAD_REQUEST = 400;
const ERROR_UNAUTHORIZED = 401;
const ERROR_FORBIDDEN = 403;
const urlPattern =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;

module.exports = {
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
  ERROR_BAD_REQUEST,
  ERROR_UNAUTHORIZED,
  ERROR_FORBIDDEN,
  ERROR_NOT_FOUND: 404,
  urlPattern,
};
