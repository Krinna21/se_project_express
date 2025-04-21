const router = require("express").Router();
const { getCurrentUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { createUser, login } = require("../controllers/users");

router.post("/signup", createUser);

router.post("/signin", login);

router.use(auth);

router.get("/users/me", getCurrentUser);

module.exports = router;
