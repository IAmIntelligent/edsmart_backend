const mongoose = require("mongoose");

const navSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const imageSchema = new mongoose.Schema({
  image: {
    filePath: String,
    contentType: String,
  },
  description: {
    type: String,
  },
});

const navlink = mongoose.model("link", navSchema);
const imageGallery = mongoose.model("imageGallery", imageSchema);
module.exports = {
  navlink,
  imageGallery,
};
