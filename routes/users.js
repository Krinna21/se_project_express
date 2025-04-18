const router = require("express").Router();
const auth = require("../middlewares/auth");
const { createUser, login } = require("../controllers/users");

router.post("/signup", createUser);
router.post("/login", login);

router.get("/me", auth, (req, res) => {
  res.status(200).json(req.user);
});
router.patch("/me", auth, (req, res) => {});

module.exports = router;
