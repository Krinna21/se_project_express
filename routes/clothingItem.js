const router = require("express").Router();
const { createItem } = require("../controllers/clothingItem");
const ClothingItem = require("../models/clothingItem");
const {
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
} = require("../utils/constants");

router.post("/", createItem);

router.put("/:itemId/likes", (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res.status(ERROR_NOT_FOUND).send({ message: "Item not found" });
      }

      if (!item.likes.includes(req.user._id)) {
        item.likes.push(req.user._id);
      }

      return item
        .save()
        .then(() => res.status(200).send(item))
        .catch((err) => {
          console.error(err);
          res
            .status(ERROR_INTERNAL_SERVER)
            .send({ message: "An error occurred while liking the item" });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(ERROR_INTERNAL_SERVER).send({ message: "An error occurred" });
    });
});

router.delete("/:itemId/likes", (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res.status(ERROR_NOT_FOUND).send({ message: "Item not found" });
      }

      const index = item.likes.indexOf(req.user._id);
      if (index !== -1) {
        item.likes.splice(index, 1);
      } else {
        return res
          .status(400)
          .send({ message: "User has not liked this item" });
      }

      return item
        .save()
        .then(() => res.status(200).send(item))
        .catch((err) => {
          console.error(err);
          res
            .status(ERROR_INTERNAL_SERVER)
            .send({ message: "An error occurred while unliking the item" });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(ERROR_INTERNAL_SERVER).send({ message: "An error occurred" });
    });
});

module.exports = router;
