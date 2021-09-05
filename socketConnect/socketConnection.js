const users = require("../model/user");

const {
  JoiningUser,
  leavingUser,
  eventRoomDeleting,
  createRoomBySocket,
  deleteMyRoomBySocket,
} = require("../controllers/roomController");
const GetTime = require("../helpers/getTime");
const { CheckUserInRoom } = require("../helpers/searchInRooms");

function socketConnecting(socket) {
  return socket.on("connection", (userdata) => {
    let namePerson = "";
    let idRoom = "";
    userdata.on("person", (data) => {
      namePerson = data;
    });

    userdata.on("theFirstVist", (id) => {
      userdata.join(id);
    });
    userdata.on("joinRoom", (id) => {
      idRoom = id;
      let TimeSending = GetTime();
      userdata.join(id);
      JoiningUser(id, namePerson).then((valOfRooms) => {
        socket.emit("OutsideView", { rooms: valOfRooms });
      });

      socket
        .to(id)
        .emit("poepleInRoom", {
          messageSocket: namePerson,
          found: true,
          Time: TimeSending,
        });
    });

    userdata.on("disconnect", (user) => {
      console.log(namePerson);
      users
        .findOneAndUpdate({ name: namePerson }, { state: false }, { new: true })
        .then((val) => {
          console.log(val, "after updated");
          users
            .find({}, { _id: 1, name: 1, email: 1, state: 1 })
            .then((allUsers) => {
              let timeLeaving = GetTime();
              socket.emit("allusers", { message: allUsers });
              CheckUserInRoom(namePerson).then((val)=>{
                if(val!==''){
              leavingUser(val, namePerson).then((va) => {
                socket.emit("OutsideView", { rooms: va });
              });
              socket
                .to(val)
                .emit("poepleInRoom", {
                  messageSocket: namePerson,
                  found: false,
                  Time: timeLeaving,
                }); 
                }
              })
            });
        });
    });

    userdata.on("deleteRoom", (data) => {
      deleteMyRoomBySocket(data).then((val) => {
        if (val === true) {
          socket.emit("update", "user made something  BACKend");
        } else {
          socket.emit("update", "not update");
        }
      });
    });

    userdata.on("createRoom", (data) => {
      createRoomBySocket(data).then((flag) => {
        if (flag === true) {
          socket.emit("update", "user made something  BACKend");
        } else {
          socket.emit("update", "not update");
        }
      });
    });

    userdata.on("userLeaveTheRoom", (data) => {
      let timeLeaving = GetTime();
      leavingUser(data.id, data.name).then((va) => {
        socket.emit("OutsideView", { rooms: va });
      });
      socket
        .to(data.id)
        .emit("poepleInRoom", {
          messageSocket: data.name,
          found: false,
          Time: timeLeaving,
        });
    });

    userdata.on("messages", (message) => {
      socket
        .to(idRoom)
        .emit("get-msg", { message: message, person: namePerson });
    });

    userdata.on("userOpen", (userName) => {
      users
        .findOneAndUpdate({ name: userName }, { state: true }, { new: true })
        .then((val) => {
          users
            .find({}, { _id: 1, name: 1, email: 1, state: 1 })
            .then((allUsers) => {
              socket.emit("allusers", { message: allUsers });
            });
        });
    });
  });
}

module.exports = socketConnecting;
