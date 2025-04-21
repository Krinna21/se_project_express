const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
  ERROR_UNAUTHORIZED,
  ERROR_CONFLICT, // ✅ Make sure this is defined as 409 in your `errors.js`
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!validator.isURL(avatar)) {
    return res
      .status(ERROR_BAD_REQUEST)
      .json({ message: "Invalid URL format for avatar" });
  }

  if (!validator.isEmail(email)) {
    return res
      .status(ERROR_BAD_REQUEST)
      .json({ message: "Invalid email format" });
  }

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({ name, avatar, email, password: hashedPassword })
    )
    .then((user) => {
      user.password = undefined;
      return res.status(201).json(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res
          .status(ERROR_CONFLICT)
          .json({ message: "Email already exists" }); // ✅ DONE
      }
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(ERROR_BAD_REQUEST).json({ message: err.message });
      }
      return res
        .status(ERROR_INTERNAL_SERVER)
        .json({ message: "An error has occurred on the server." });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return res
          .status(ERROR_UNAUTHORIZED)
          .json({ message: "Invalid credentials" });
      }
      return bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) {
          return res
            .status(ERROR_UNAUTHORIZED)
            .json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        return res.status(200).json({ token });
      });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(ERROR_INTERNAL_SERVER)
        .json({ message: "An error has occurred on the server." });
    });
};

module.exports = { createUser, login };
