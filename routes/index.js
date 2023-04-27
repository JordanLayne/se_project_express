const router = require("express").Router();
const clothingItem = require("./clothingItems");
const { login, createUser } = require("../controllers/user");
const users = require("./users");

const auth = require("../middlewares/auth");
const { DOES_NOT_EXIST_CODE } = require("../utils/errors");



router.use("/items", clothingItem);

router.use("/users", auth, users);

router.post("/signin", login);

router.post("/signup", createUser);

router.use((req, res) => {
  res.status(DOES_NOT_EXIST_CODE).send({
    message: `Route does not exist`,
  });
});

module.exports = router;