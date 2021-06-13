let express=require('express');
let app = express(); 
const cors=require('cors');
const examsRouter=require('./routers/exams.router');
const userRouter=require('./routers/user.router');
const roomRouter=require('./routers/rooms.Router');
const blogRouter=require('./routers/blog.router');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const socketConnecting = require('./socketConnect/socketConnection');
require('dotenv').config()
let PORT=process.env.PORT||5000
const url =process.env.DB_MONGO
const http=require("http").createServer(app);
const socket = require("socket.io")(
  http,
  {
    cors: {
      origin:process.env.ORIGIN_CLINET,
      credentials: true,
    },
  }
);


mongoose.connect(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
},()=>{
console.log('connected to mongoDB.....')
http.listen(PORT,()=>{
console.log('server is runnnig......')
})
})



// connecting to socket
socketConnecting(socket)

app.use(express.static('img'))
app.use(cors())
app.use(bodyParser.json())

//routing :
app.use('/blog/',blogRouter);
app.use('/server/',examsRouter)
app.use('/account',userRouter);
app.use('/socket/',roomRouter)

