const validator = require("validator");
const User = require("../models/user");
const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
} = require("../utils/errors");

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

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  if (!validator.isURL(avatar)) {
    return res
      .status(ERROR_BAD_REQUEST)
      .json({ message: "Invalid URL format for avatar" });
  }

  return User.create({ name, avatar })
    .then((user) => res.status(201).json(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(ERROR_BAD_REQUEST).json({ message: err.message });
      }
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

module.exports = { getUsers, createUser, getUser };
