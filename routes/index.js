const router = require("express").Router();
const { createUser, login } = require("../controllers/users");
const { ERROR_NOT_FOUND } = require("../utils/constants");

const userRouter = require("./users");
const itemRouter = require("./clothingItem");

router.post("/signup", createUser);
router.post("/signin", login);

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
