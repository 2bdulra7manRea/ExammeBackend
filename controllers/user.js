const user = require("../model/user");
const Exams = require("../model/exam");
const notify = require("../model/notifactions");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { CreateNotification } = require("../helpers/notifications");

function sendingError(res, message, status) {
  return res.status(status).json({ errorMessage: message });
}

function sendingDoc(res, doc) {
  res.status(200).json({ message: doc });
}

module.exports.userRegister = async (req, res) => {
  console.log(req.file);
  const img = fs.readFileSync(req.file.path);
  let encode_img = img.toString("base64");
  var FinalImg = {
    type: req.file.mimetype,
    image: new Buffer.from(encode_img, "base64"),
  };

  const { name, password, email } = req.body;
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);
  const User = new user({ name, password: hash, email });
  try {
    const result = await User.save();
    let userProfile = {
      name: result.name,
      id: result._id,
    };
    let token = await jwt.sign(userProfile, 'SPRECHEN');
    let userAccount = {
      name: result.name,
      token: token,
      email: result.email,
      _id: result._id,
    };
    const resultNofity = await CreateNotification(
      "it`s a great pleasure to have you ",
      result._id
    );
    sendingDoc(res, userAccount);
  } catch (error) {
    sendingError(res, "User connot register", 500);
  }
};

module.exports.userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const doc = await user.findOne({ email: email });
    const resultHash = await bcrypt.compare(password, doc.password);
    if (resultHash) {
      const token = await jwt.sign(
        { name: doc.name, id: doc._id },
        'SPRECHEN'
      );
      let userAccount = {
        name: doc.name,
        token: token,
        email: doc.email,
        _id: doc._id,
      };

      const resultNofity = await CreateNotification("Welcome Back !", doc._id);
      console.log(resultNofity);
      sendingDoc(res, userAccount);
    } else {
      sendingError(res, "password or email is not correct", 400);
    }
  } catch (error) {
    sendingError(res, "User connot login", 500);
  }
};

module.exports.userExams = async (req, res) => {
  try {
    const iduser = req.params.id;
    const userInfo = await user.findOne({ _id: iduser });
    if (userInfo !== "") {
      const { exam_ids } = userInfo;
      console.log(exam_ids);
      console.log(userInfo);
      if (exam_ids.length !== 0) {
        const exmas = await Exams.find({ _id: { $in: [...exam_ids] } });
        res.json({ exmas: exmas });
      } else {
        sendingError(res, "no exmas for that user", 500);
      }
    } else {
      sendingError(res, "no user", 500);
    }
  } catch (error) {
    sendingError(res, "connot find exam", 500);
  }
};

module.exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await user.find(
      {},
      { _id: 1, name: 1, email: 1, state: 1 }
    );
    res.json({ message: allUsers });
  } catch (error) {
    sendingError(res, "no users be found", 500);
  }
};

module.exports.delateMyAccount = async (req, res) => {
  try {
    const id = req.params.id;
    const resultDelate = await user.deleteOne({ _id: id });
    sendingDoc(res, resultDelate);
  } catch (error) {
    sendingError(res, "user connot be deleted", 500);
  }
};

module.exports.getUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const UserInfo = await user.findOne({ _id: id }, { password: 0 });
    res.json(UserInfo);
  } catch (error) {
    res.status(500).json({ err: error });
  }
};

module.exports.FollowMe = (req, res) => {
  const { followerName } = req.body;
  user
    .updateOne(
      { _id: req.body.followed },
      { $push: { followers: req.body.follower } }
    )
    .then((result) => {
      CreateNotification(followerName + " followes you", req.body.followed)
        .then((noifiing) => {
          user
            .updateOne(
              { _id: req.body.follower },
              { $push: { following: req.body.followed } }
            )
            .then((val) => {
              res.json(result);
            });
        })
        .catch((errResuly) => {
          res.json(errResuly);
        });
    })
    .catch((err) => {
      res.json(err);
    });
};

module.exports.UnFollowMe = (req, res) => {
  // i want two ids
  /// one for target Followed
  // second for follower
  user
    .updateOne(
      { _id: req.body.followed },
      { $pull: { followers: req.body.follower } }
    )
    .then((result) => {
      user
        .updateOne(
          { _id: req.body.follower },
          { $pull: { following: req.body.followed } }
        )
        .then((val) => {
          res.json({ unpull: result });
        });
    })
    .catch((err) => {
      res.json(err);
    });
};

module.exports.GetMyNotifications = async (req, res) => {
  const id = req.params.id;
  try {
    const noificationsOfuser = await user.findOne(
      { _id: id },
      { notification_Obj: 1 }
    );

    // this is array of ids
    const result = await notify.find(
      { _id: { $in: noificationsOfuser.notification_Obj } },
      { message: 1, date: 1 }
    );
    res.json(result);
  } catch (error) {
    res.json(error);
  }
};

module.exports.getFollowers = async (req, res) => {
  try {
    const id = req.params.id;
    let { followers } = await user.findOne({ _id: id });
    let followerUsers = await user.find({ _id: { $in: followers } });
    res.json(followerUsers);
  } catch (error) {
    res.json(error);
  }
};

module.exports.getFollowing = async (req, res) => {
  try {
    const id = req.params.id;
    let { following } = await user.findOne({ _id: id });
    let followingUsers = await user.find({ _id: { $in: following } });
    res.json(followingUsers);
  } catch (error) {
    res.json(error);
  }
};
