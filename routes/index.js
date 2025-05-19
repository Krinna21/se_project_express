const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { createUser, login } = require("../controllers/users");
const { ERROR_NOT_FOUND } = require("../utils/constants");

const userRouter = require("./users");
const itemRouter = require("./clothingItem");

router.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      avatar: Joi.string()
        .pattern(/^https?:\/\/[^\s]+$/)
        .optional(),
    }),
  }),
  createUser
);

router.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login
);

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
