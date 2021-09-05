const room = require("../model/room");






module.exports.CheckUserInRoom=async(namuser)=>{
const roomId=await room.findOne({users:{$in:namuser}});
if(roomId){
return roomId._id    
}else{
    return ''
}
}