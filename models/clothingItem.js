const mongoose = require("mongoose");
const validator = require("validator");

const clothingItems = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  weather: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "Link is not Valid",
    },
  },
});

const ClothingItem = mongoose.model("ClothingItem", clothingItems);

module.exports = ClothingItem;
