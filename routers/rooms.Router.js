const { createRoom, getRoom, getRoomById, deleteMyRoom } = require('../controllers/roomController');
const verifyAuth = require('../middleware/verify.auth');

const router=require('express').Router();


router.post('/room',verifyAuth,createRoom);
router.get('/room',getRoom)
router.get('/room/:id',verifyAuth,getRoomById)
router.delete('/room/:idRoom/:userName',verifyAuth,deleteMyRoom)
module.exports=router;