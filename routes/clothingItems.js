const router = require("express").Router();
const {
  getClothing,
  removeClothing,
  addClothing,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.get("/", getClothing);

router.delete("/:itemId", removeClothing);

router.post("/", addClothing);

router.put("/:itemId/likes", likeItem);

router.delete("/:itemId/likes", dislikeItem);

module.exports = router;