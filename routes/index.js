const router = require("express").Router();
const clothingItem = require("./clothingItems");
const { login, createUser } = require("../controllers/user");
const users = require("./users");

const auth = require("../middlewares/auth");
const { DOES_NOT_EXIST_CODE } = require("../utils/errors");

router.use("/users", users);
router.use("/items", clothingItem);

router.use((req, res, next) => {
  if (
    req.path === "/signin" ||
    req.path === "/signup" ||
    req.path === "/items"
  ) {
    return next();
  }

  return auth(req, res, next);
});
router.post("/signin", login);
router.post("/signup", createUser);

router.use((req, res) => {
  res.status(DOES_NOT_EXIST_CODE).send({
    message: `Route does not exist`,
  });
});

module.exports = router;