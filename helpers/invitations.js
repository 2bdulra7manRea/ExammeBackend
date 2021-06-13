const notify = require("../model/notifactions");
const user = require("../model/user");

module.exports.SendInvitations = async (roomObj) => {
  let message =
    roomObj.userName +
    " invited you to " +
    roomObj.name +
    " Room for talking with you !";
  let invitationMessage = await notify.create({
    message: message,
    date: Date.now(),
  });
  let resultNofityMessage = await invitationMessage.save();
  roomObj.invitation.forEach(async (element) => {
    await user.updateOne(
      { _id: element },
      { $push: { notification_Obj: resultNofityMessage._id } }
    );
  });
};
