const router = require("express").Router();
const {
  getUsers,
  createUser,
  getUser,
  login,
} = require("../controllers/users");

router.post("/signup", createUser);
router.post("/signin", login);
router.get("/", getUsers);
router.get("/:userId", getUser);

module.exports = router;
