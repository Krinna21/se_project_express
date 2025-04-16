const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
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
    .then((hashedPassword) => {
      return User.create({ name, avatar, email, password: hashedPassword });
    })
    .then((user) => res.status(201).json(user))
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(409).json({ message: "Email already exists" });
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
        return res.status(ERROR_NOT_FOUND).json({ message: "User not found" });
      }
      return bcrypt.compare(password, user.password);
    })
    .then((isMatch) => {
      if (!isMatch) {
        return res
          .status(ERROR_UNAUTHORIZED)
          .json({ message: "Invalid credentials" });
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).json({ token });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(ERROR_INTERNAL_SERVER)
        .json({ message: "An error has occurred on the server." });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).json(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(ERROR_INTERNAL_SERVER)
        .json({ message: "An error has occurred on the server." });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).json(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(ERROR_BAD_REQUEST)
          .json({ message: "Invalid user ID format." });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(ERROR_NOT_FOUND).json({ message: "User not found." });
      }
      return res
        .status(ERROR_INTERNAL_SERVER)
        .json({ message: "An error has occurred on the server." });
    });
};

module.exports = { getUsers, createUser, getUser, login };
