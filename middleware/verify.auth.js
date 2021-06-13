const jwt=require('jsonwebtoken');
const user=require('../model/user');
module.exports=async(req,res,next)=>{
const token=req.headers.token;
if(!token){
res.json({message:"you are not authrized",case:0})
}else{
try {
let decodedToken=await jwt.verify(token,process.env.JWT_SECRET);
const resultUser=await user.findOne({_id:decodedToken.id,name:decodedToken.name});
if(resultUser!==''){
    next();
}else{
    res.json({message:"you are not authrized",case:1})
}
} catch (error) {
res.json({message:"you are not authrized",case:2})
}

}
}