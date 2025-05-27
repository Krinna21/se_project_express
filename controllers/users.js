const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const BadRequestError = require("../errors/BadRequestError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const NotFoundError = require("../errors/NotFoundError");
const ConflictError = require("../errors/ConflictError");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!validator.isURL(avatar)) {
    return next(new BadRequestError("Invalid URL format for avatar"));
  }

  if (!validator.isEmail(email)) {
    return next(new BadRequestError("Invalid email format"));
  }

  return bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({ name, avatar, email, password: hashedPassword })
    )
    .then(({ _id, name: userName, avatar: userAvatar, email: userEmail }) =>
      res
        .status(201)
        .json({ _id, name: userName, avatar: userAvatar, email: userEmail })
    )
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError("Email already exists"));
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError("Invalid credentials");
      }
      return bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) {
          throw new UnauthorizedError("Invalid credentials");
        }
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        return res.status(200).json({ token });
      });
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User not found");
      }
      res.status(200).json(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user ID format"));
      }
      return next(err);
    });

const updateCurrentUser = (req, res, next) => {
  const { name, avatar } = req.body;

  if (avatar && !validator.isURL(avatar)) {
    return next(new BadRequestError("Invalid URL format for avatar"));
  }

  return User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User not found");
      }
      res.status(200).json(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateCurrentUser,
};
