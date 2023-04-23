const router = require("express").Router();
const clothingItem = require("./clothingItems");
const { getUsers, findUser, createUser } = require("../controllers/user");
const { DOES_NOT_EXIST_CODE } = require("../utils/errors");

router.get("/users", getUsers);

router.get("/users/:userId", findUser);

router.post("/users", createUser);

router.use("/items", clothingItem);

router.use((req, res) => {
  res.status(DOES_NOT_EXIST_CODE).send({
    message: `Route does not exist`,
  });
});

module.exports = router;