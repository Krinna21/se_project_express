const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { UnauthorizedError } = require("../errors/UnauthorizedError");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: [true, "The avatar field is required."],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "Invalid email format",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError("Invalid credentials"));
      }

      return bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) {
          return Promise.reject(new UnauthorizedError("Invalid credentials"));
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
