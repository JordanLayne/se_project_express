const router = require("express").Router();
const {
  getClothing,
  removeClothing,
  addClothing,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");
const { validateItemInfo, validateIds } = require("../middlewares/validator");

router.get("/", getClothing);

router.delete("/:itemId", auth, validateIds, removeClothing);

router.post("/", auth, validateItemInfo, addClothing);

router.put("/:itemId/likes", auth, validateIds, likeItem);

router.delete("/:itemId/likes", auth, validateIds, dislikeItem);

module.exports = router;
