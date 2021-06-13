const monooose = require("mongoose");

const schemaBlog = monooose.Schema({
  user: { type: Object },
  content: { type: String },
  title: { type: String },
  date: { type: Date },
});

module.exports = monooose.model("BlogExam", schemaBlog);
