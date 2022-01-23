const mongoose = require("mongoose");

//Book Schema
const BookSchema = mongoose.Schema({
  ISBN: String,
  title: String,
  pubDate: String,
  language: String,
  numPage: Number,
  author: [Number],
  publications: Number,
  category: [String]
});

//Creating book model
const BookModel = mongoose.model("books",BookSchema);
module.exports = BookModel;
