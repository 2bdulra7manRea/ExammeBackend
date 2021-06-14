const { getRoom, getRoomById } = require('../controllers/roomController');
const verifyAuth = require('../middleware/verify.auth');

const router=require('express').Router();

router.get('/room',getRoom)
router.get('/room/:id',verifyAuth,getRoomById)

module.exports=router;