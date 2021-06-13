const mongoose = require("mongoose");

const schemaUser = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  followers: [{ type: String }],
  following: [{ type: String }],
  img: { type: Object },
  location: {
    lat: Number,
    lang: Number,
  },
  state: { type: Boolean },
  notification_Obj: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Notification" },
  ],
  exam_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exam" }],
});

module.exports = mongoose.model("UserExam", schemaUser);
