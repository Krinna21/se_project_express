const ClothingItem = require("../models/clothingItem");
const {
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
  ERROR_BAD_REQUEST,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  const newItem = new ClothingItem({
    name,
    weather,
    imageUrl,
    owner: req.user._id,
    likes: [],
  });

  newItem
    .save()
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_BAD_REQUEST)
          .send({ message: "Invalid data provided." });
      }
      console.error(err);
      return res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: "An error occurred on the server." });
    });
};

const getItems = (req, res) => {
  ClothingItem.find()
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res
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
      return res.status(200).send({ message: "Item deleted successfully." });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(ERROR_BAD_REQUEST)
          .send({ message: "Invalid item ID." });
      }
      console.error(err);
      return res
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
      return res.status(200).send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(ERROR_BAD_REQUEST)
          .send({ message: "Invalid item ID." });
      }
      console.error(err);
      return res
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
      return res.status(200).send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(ERROR_BAD_REQUEST)
          .send({ message: "Invalid item ID." });
      }
      console.error(err);
      return res
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
