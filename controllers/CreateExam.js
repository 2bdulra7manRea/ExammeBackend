const mongoose = require("mongoose");
const Exam = require("../model/exam");
const questions = require("../model/questions");
const notifactions = require("../model/notifactions");
const user = require("./../model/user");
const {
  CreateNotification,
  SendNotificationsToFollowrs,
} = require("../helpers/notifications");

async function searchInExam(body) {
  const exams = await Exam.findOne({ title: body.title })
    .then((val) => {
      if (val) {
        return true;
      } else {
        return false;
      }
    })
    .catch((err) => {
      throw new Error("Error in seaching");
    });

  return exams;
}

module.exports.createExam = (req, res) => {
  const dataExam = req.body;
  const userId = req.body.id;

  user
    .findOne({ _id: userId }, { _id: 1, name: 1, state: 1, img: 1, email: 1 })
    .then((resultUser) => {
      if (resultUser) {
        searchInExam(dataExam)
          .then((flag) => {
            if (flag === false) {
              Exam.create({
                title: dataExam.title,
                type: dataExam.type,
                duration: dataExam.duration,
                Nquestions: dataExam.Nquestions,
                access: dataExam.access,
                key: dataExam.key,
                timeCreated: Date.now(),
                examOwner: resultUser,
              })
                .then((result) => {
                  notifactions
                    .create({
                      message:
                        "Congrats ! You have yet created a new exam " +
                        result.title,
                      date: Date.now(),
                      user_id: result.examOwner._id,
                    })
                    .then((notfiyresult) => {
                      user
                        .findOneAndUpdate(
                          { _id: userId },
                          {
                            $push: {
                              notification_Obj: notfiyresult._id,
                              exam_ids: result._id,
                            },
                          }
                        )
                        .then((resultfinal) => {
                          SendNotificationsToFollowrs(
                            userId,
                            resultfinal.name +
                              " have created now Exam" +
                              result.title +
                              ";"
                          );
                          res.json({ message: resultfinal });
                        });
                    });
                })
                .catch((er) => {
                  res.json({ message: er });
                });
            } else {
              res.send("THE TITLE MUST BE UNIQUE");
            }
          })
          .catch((err) => {
            res.json({ messageError: err });
          });
      } else {
        res.json({ messageError: "no user" });
      }
    })
    .catch((err) => {
      res.status(500).json({ messageError: err });
    });
};

module.exports.getExams = (req, res) => {
  Exam.find({ access: { $ne: "private" } })
    .then((result) => {
      res.json({ exmas: result });
    })
    .catch((err) => {
      res.json({ error: err });
    });
};

module.exports.getExamDetails = (req, res) => {
  Exam.findOne({ _id: req.params.id })
    .then((val) => {
      if (val) {
        questions
          .findOne({ _id: val.questions_id })
          .then((ResultQuestions) => {
            if (ResultQuestions === null) {
              res.json({ exam: val, questions: null });
            } else {
              res.json({ exam: val, questions: ResultQuestions });
            }
          })
          .catch((err) => {
            res.status(500).json({ errormessage: err });
          });
      } else {
        res.status(500).json({ errormessage: "No exam be found" });
      }
    })
    .catch((err) => {
      res.json({ ErrorMessage: err });
    });
};

module.exports.CreateQuestions = (req, res) => {
  Exam.findOne({ _id: req.params.id })
    .then((val) => {
      if (val) {
        if (val.questions_id === null) {
          questions
            .create({ title_exam: val.title, questions: req.body })
            .then((val) => {
              Exam.findOneAndUpdate(
                { _id: req.params.id },
                { $set: { questions_id: val._id } }
              )
                .then((result) => {
                  console.log(result);
                  CreateNotification(
                    "you have yet created a new questions in" +
                      result.title +
                      "exam",
                    result.examOwner._id
                  )
                    .then((v) => {
                      SendNotificationsToFollowrs(
                        result.examOwner._id,
                        result.examOwner.name +
                          " created new questions in " +
                          result.title
                      );
                      res.json({ result: result });
                    })
                    .catch((e) => {
                      res.json(e);
                    });
                })
                .catch((err) => {
                  res.status(500).json({ messageError: err });
                });
            });
        } else {
          res
            .status(500)
            .json({ messageError: "You created the Exam questions before" });
        }
      } else {
        res.status(401).json({ messageError: "no exam found" });
      }
    })
    .catch((er) => {
      res.status(500).json({ messageError: er });
    });
};

module.exports.DeleteMyExam = async (req, res) => {
  console.log(req.params.id);
  try {
    const { questions_id, examOwner, title } = await Exam.findOne(
      { _id: req.params.id },
      { title: 1, questions_id: 1, examOwner: 1 }
    );
    console.log(questions_id);
    if (questions_id !== "") {
      const resultOfDeletedQuestion = await questions.deleteOne({
        _id: questions_id,
      });
      console.log(resultOfDeletedQuestion);
    }
    const resultOfDeletedExam = await Exam.deleteOne({ _id: req.params.id });
    if (resultOfDeletedExam) {
      CreateNotification(
        "you have yet deleted your exam " + title,
        examOwner._id
      )
        .then((v) => {
          res.json({ message: resultOfDeletedExam });
        })
        .catch((e) => {
          res.json(e);
        });
    } else {
      throw new Error("connot delete EXAM");
    }
  } catch (error) {
    res.json({ err: error });
  }
};
