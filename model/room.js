const mongoose = require("mongoose");

const schemaRooms = mongoose.Schema({
  name: String,
  userName: String,
  access: String,
  type: String,
  invitation: Object,
  users: [{ type: String }],
});

module.exports = mongoose.model("RoomChat", schemaRooms);
