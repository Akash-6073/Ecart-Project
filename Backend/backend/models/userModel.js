const mongoose = require('mongoose');
const validator = require('validator');
const brcypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name :{
        type:String,
        required:[true,"Please Enter your Name"],
        maxLength:[30,"Cannot Exceed 30 characters"],
        minLength:[3,"Name should have more than 3 characters"]
    },
    email:{
        type:String,
        unique:true,
        required:[true,"Please Enter your Email"],
        validate:[validator.isEmail,"Please Enter a valid Email"]
    },
    password:{
        type:String,
        required:[true,"Enter your password"],
        minLength:[8,"Password should be atleast 8 characters"],
        select:false,  // this will be not selected in mongodb database
    },
    avatar:
    {
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    resetPasswordToken:String, 
    resetPasswordExpire:Date, 
    
});


//Bcryptjs : hashing the password , so no one can hack it
userSchema.pre('save',async function(next){

    if(!this.isModified("password"))
    {
        next();
    }
    this.password = await brcypt.hash(this.password,10)  // here we arre using 'this' , so arrow function doesn't work here 
})


// JsonWebToken (JWT)

userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE})
}

// Comapre password

userSchema.methods.comparePassword = async function(enteredPass){
        return await brcypt.compare(enteredPass,this.password)
}


// Generate Reset password token
userSchema.methods.getResetPasswordToken = function(){
    // Generating token
    const resetToken = crypto.randomBytes(20).toString("hex")

    // Hashing and adding resetPasswordToken to UserSchema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000 // it means adding 15 min to reset password

    return resetToken
}

module.exports = mongoose.model("User",userSchema)