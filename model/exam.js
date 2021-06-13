const mongoose = require("mongoose");

const schema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
  },
  duration: {
    type: Number,
  },

  Nquestions: {
    type: Number,
  },

  timeCreated: { type: Date },
  examOwner: { type: Object },
  questions_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Questions",
    default: null,
  },
  access: {
    type: String,
  },
  key: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("Exam", schema);
