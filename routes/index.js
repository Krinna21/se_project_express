const router = require("express").Router();
const { ERROR_NOT_FOUND } = require("../utils/constants");

const userRouter = require("./users");
const itemRouter = require("./clothingItem");

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: "Route not found" });
});

module.exports = router;
