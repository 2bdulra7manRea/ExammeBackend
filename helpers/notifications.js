const notify = require("../model/notifactions");
const user = require("../model/user");

module.exports.CreateNotification = async (message, userId) => {
  try {
    const userNotify = await notify.create({
      message: message,
      date: Date.now(),
      user_id: userId,
    });
    const result = await userNotify.save();
    const userResult = await user.updateOne(
      { _id: userId },
      { $push: { notification_Obj: result._id } }
    );

    return { userInfoupdate: userResult, notifyUserUpdate: result };
  } catch (error) {
    return error;
  }
};

module.exports.SendNotificationsToFollowrs = async (userId, message) => {
  try {
    const { followers } = await user.findOne({ _id: userId });
    const notifyResult = await notify.create({
      message: message,
      date: Date.now(),
    });

    followers.forEach(async (element) => {
      let UNUp = await user.updateOne(
        { _id: element },
        { $push: { notification_Obj: notifyResult._id } }
      );
      console.log(UNUp);
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
