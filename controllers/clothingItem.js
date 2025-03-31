const ClothingItem = require("../models/clothingItem");
const { ERROR_BAD_REQUEST, ERROR_INTERNAL_SERVER } = require("../utils/errors");

const createItem = (req, res) => {
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_BAD_REQUEST)
          .send({ message: "Invalid item data." });
      }
      return res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = {
  createItem,
};
