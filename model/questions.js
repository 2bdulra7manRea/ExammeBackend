const mongoose = require("mongoose");

const schemaQuestion = mongoose.Schema({
  title_exam: String,
  questions: [
    {
      _id: false,
      question: String,
      answerRight: String,
      answerWrong2: String,
      answerWrong1: String,
      answer: String,
    },
  ],
});

module.exports = mongoose.model("Questions", schemaQuestion);
