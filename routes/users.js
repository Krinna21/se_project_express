const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.use(auth);

router.get("/me", getCurrentUser);

router.patch(
  "/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(/^https?:\/\/[^\s]+$/),
    }),
  }),
  updateCurrentUser
);

module.exports = router;
