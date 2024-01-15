const mongoose = require('mongoose') 

const connectDatabase = ()=>{
    mongoose.connect(process.env.DB_URI,{dbName:'Ecommerce'}).then((data)=>{
        console.log(`MongoDB connected to ${data.connection.host}`)
    }) 
}

module.exports = connectDatabase