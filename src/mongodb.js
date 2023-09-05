const mongoose = require("mongoose");
const signupSchema = mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
});
const collection = new mongoose.model("collection", signupSchema);

module.exports = collection;
