const mongoose = require("mongoose");

let schema = mongoose.Schema({
  message: String,
  date: Date,
  user_id: String,
});

module.exports = mongoose.model("Notification", schema);
