const { CreateBlog,getBlogsOfFollowersUser, getBlogContent } = require('../controllers/createBlog');
const verifyAuth = require('../middleware/verify.auth');
let router=require('express').Router();




router.post('/create',verifyAuth,CreateBlog);
router.get('/all/:id',verifyAuth,getBlogsOfFollowersUser)
router.get('/content/:id',verifyAuth,getBlogContent)
module.exports=router;