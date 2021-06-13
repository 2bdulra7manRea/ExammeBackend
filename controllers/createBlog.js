const blog = require("../model/blog");
const user = require("../model/user");
const {
  CreateNotification,
  SendNotificationsToFollowrs,
} = require("../helpers/notifications");

module.exports.CreateBlog = async (req, res) => {
  try {
    const userid = req.body.userId;
    const userInfo = await user.findOne(
      { _id: userid },
      { _id: 1, name: 1, img: 1 }
    );
    const Blog = {
      content: req.body.content,
      date: Date.now(),
      title: req.body.title,
      user: userInfo,
    };
    let result = await blog.create(Blog);
    let resultOfBlog = await result.save();
    res.json(resultOfBlog);
    CreateNotification("Your blog is ready !", userid).then((v) => {});

    SendNotificationsToFollowrs(
      userid,
      userInfo.name + " created a new blog ! take a look-> "
    );
  } catch (error) {
    res.json(error);
  }
};

module.exports.getBlogsOfFollowersUser = async (req, res) => {
  try {
    let { following } = await user.findOne({ _id: req.params.id });
    following.push(req.params.id);
    let allBlogs = await blog.find({});
    let followingBlogs = allBlogs.filter((element) => {
      return following.includes(element.user._id);
    });
    res.json(followingBlogs);
  } catch (error) {
    res.json(error);
  }
};

module.exports.getBlogContent = (req, res) => {
  blog
    .findOne({ _id: req.params.id })
    .then((val) => {
      res.json(val);
    })
    .catch((err) => {
      res.json(err);
    });
};
