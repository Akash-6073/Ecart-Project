const app =require('./app')
const cloudinary = require('cloudinary')
const connectDatabase  =require('./config/database')


// Handling uncaught Exception
process.on("uncaughtException",(err)=>{
    console.log(`Error : ${err.message}`);
    console.log(`Shutting down the Server due to some uncaught Exception`);
    process.exit(1)
    
})


// config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require('dotenv').config({path:'backend/config/config.env'})
}

// connecting to DataBase
connectDatabase()
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,

})

const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server is listening on http://localhost:${process.env.PORT}`)
})

//  unhandled promise rejection  when the server is not connected this will handle the error

process.on("unhandledRejection",(err)=>{
    console.log(`Error : ${err.message}`);
    console.log(`Shutting down the Server due to some unhandled promise rejection`);
    server.close(()=>{
        process.exit(1);
    })
})