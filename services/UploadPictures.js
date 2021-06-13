const multer=require('multer');

const storage=multer.diskStorage({
destination:(req,file,cb)=>{
cb(null,'img/')
},
filename:(req,file,cb)=>{
    const {originalname}=file
    cb(null,originalname)
}
})

 var upload=multer({storage:storage});
module.exports=upload
