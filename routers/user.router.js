const { userRegister, userLogin, userExams, getAllUsers, delateMyAccount, getUserById, FollowMe, UnFollowMe, GetMyNotifications, getFollowers, getFollowing } = require('../controllers/user');
const upload = require('../services/UploadPictures');
const verifyAuth = require('../middleware/verify.auth');


const router=require('express').Router();



router.post('/register',userRegister);
router.post('/login',userLogin);
router.get('/myexams/user/:id',userExams)
router.get('/users',getAllUsers)
router.delete('/user/delete',verifyAuth,delateMyAccount)
router.get('/user/:id',verifyAuth,getUserById)
router.get('/user/followers/:id',verifyAuth,getFollowers)
router.get('/user/following/:id',verifyAuth,getFollowing)
router.post('/user/follow',verifyAuth,FollowMe)
router.post('/user/unfollow',verifyAuth,UnFollowMe);
router.get('/user/noifications/:id',verifyAuth,GetMyNotifications)
module.exports=router;
