const mongoose = require("mongoose");

//Book Schema
const AuthorSchema = mongoose.Schema({
  id: Number,
  name: String,
  books:[String]
});

//Creating book model
const AuthorModel = mongoose.model("authors",AuthorSchema);

module.exports = AuthorModel;
