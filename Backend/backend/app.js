const express = require('express');
const cookieParser = require('cookie-parser')
const errorMiddleware = require('./middleware/error')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
// const path = require("path")
const cors = require('cors')

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require('dotenv').config({path:'backend/config/config.env'})
}

const app = express();

app.use(cors(
    {
        origin:["https://ecart-smoky.vercel.app/"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials:true
    }
))

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true,parameterLimit:1000000,limit:"500mb"}))
app.use(bodyParser.json());
app.use(fileUpload());


//Route imports 
const product = require('./routes/productRoute')
const user = require('./routes/userRoute');
const order = require('./routes/orderRoute')
const payment = require('./routes/paymentRoute')



app.use('/api/v1',product)
app.use('/api/v1',user)
app.use('/api/v1',order)
app.use('/api/v1',payment)

// app.use(express.static(path.join(__dirname,"../frontend/build")));

// app.get('*',(req,res)=>{
//     res.sendFile(path.resolve(__dirname,'../frontend/build/index.html'))
// })

// Middleware error
app.use(errorMiddleware)


module.exports=app