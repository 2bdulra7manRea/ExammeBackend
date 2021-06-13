const room = require("../model/room");

var events = require("events");
const { SendInvitations } = require("../helpers/invitations");
module.exports.eventRoomDeleting = new events.EventEmitter();

module.exports.getRoom = (req, res) => {
  room
    .find({})
    .then((val) => {
      res.json(val);
    })
    .catch((err) => {
      res.status(500).json({ errorMessage: err });
    });
};

module.exports.getRoomById = (req, res) => {
  room
    .findOne({ _id: req.params.id })
    .then((result) => {
      if (result !== "") {
        res.json(result);
      } else {
        res.status(500).json({ message: "no room" });
      }
    })
    .catch((err) => {
      res.json(err);
    });
};

module.exports.JoiningUser = async (idroom, namePerson) => {
  let { users } = await room.findOne({ _id: idroom });
  let flagCheckingUserFound = users.includes(namePerson);
  console.log(flagCheckingUserFound);
  if (flagCheckingUserFound) {
    let roomsRes = await room.find({});
    return roomsRes;
  } else {
    let roomResult = await room.updateOne(
      { _id: idroom },
      { $push: { users: namePerson } }
    );
    let roomsRes = await room.find({});
    return roomsRes;
  }
};

module.exports.leavingUser = async (idroom, namePerson) => {
  let roomResult = await room.updateOne(
    { _id: idroom },
    { $pull: { users: namePerson } }
  );
  let roomsRes = await room.find({});
  return roomsRes;
};

module.exports.createRoomBySocket = async (body) => {
  try {
    let resultOfRoom = await room.create({
      name: body.name,
      invitation: body.invitation,
      userName: body.userName,
      access: body.access,
      type: body.type,
      numPeople: body.numPeople,
    });
    let resultOFSaving = await resultOfRoom.save();
    SendInvitations(resultOFSaving);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports.deleteMyRoomBySocket = async (body) => {
  //id
  //username

  try {
    let { userName } = await room.findOne({ _id: body.idRoom });
    if (userName === body.userName) {
      let resultOfDeleting = await room.deleteOne({ _id: body.idRoom });
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};
