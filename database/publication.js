const mongoose = require("mongoose");

//Book Schema
const PublicationSchema = mongoose.Schema({
  id: Number,
  name: String,
  books:[String]
});

//Creating book model
const PublicationModel = mongoose.model("publications",PublicationSchema);
module.exports = PublicationModel;
