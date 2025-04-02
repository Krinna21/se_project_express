const ClothingItem = require("../models/clothingItem");
const { ERROR_NOT_FOUND, ERROR_INTERNAL_SERVER } = require("../utils/errors");

const createItem = (req, res) => {
  const { name, description, price, image } = req.body;

  const newItem = new ClothingItem({
    name,
    description,
    price,
    image,
    likes: [],
  });

  newItem
    .save()
    .then((item) => {
      res.status(201).send(item);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: "An error occurred on the server." });
    });
};

const getItems = (req, res) => {
  ClothingItem.find()
    .then((items) => {
      if (items.length === 0) {
        return res.status(ERROR_NOT_FOUND).send({ message: "No items found." });
      }
      res.status(200).send(items);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: "An error occurred on the server." });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .then((item) => {
      if (!item) {
        return res.status(ERROR_NOT_FOUND).send({ message: "Item not found." });
      }
      res.status(200).send({ message: "Item deleted successfully." });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: "An error occurred on the server." });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(ERROR_NOT_FOUND).send({ message: "Item not found." });
      }
      res.status(200).send(item);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: "An error occurred on the server." });
    });
};

const unlikeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(ERROR_NOT_FOUND).send({ message: "Item not found." });
      }
      res.status(200).send(item);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: "An error occurred on the server." });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
