const router = require("express").Router();

const clothingItem = require("./clothingItems");

const users = require("./users");

const { DOES_NOT_EXIST_CODE } = require("../utils/errors");

router.use("/users", users);
router.use("/items", clothingItem);

router.use((req, res) => {
  res.status(DOES_NOT_EXIST_CODE).send({
    message: `Route does not exist`,
  });
});

module.exports = router;
