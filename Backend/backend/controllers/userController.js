const ErrorHandler = require('../utils/errorhandler')
const catchAsyncError = require('../middleware/catchAsyncError')  // this works as try catch for async functions
const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const cloudinary = require('cloudinary')


// Register a user
exports.registerUser = catchAsyncError(async(req,res,next)=>{

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:"avatars", // this is folder from CLOUDINARY WEBSITE
        width:150,
        crop:"scale"
    })
    const {name,email,password}= req.body; // this will get from the html body

    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:myCloud.public_id,
            url:myCloud.secure_url,
        },
    });

    sendToken(user,200,res)
});


// Login a User

exports.loginUser = catchAsyncError(async(req,res,next)=>{
    const {email,password} =req.body;
    if(!email || !password){
        return next(new ErrorHandler("Please Enter Email & Password",400))
    }

    //  This will check whether the email is correct or not
    const user = await User.findOne({email}).select("+password");
    if(!user)
    {
            return next(new ErrorHandler("Invalid email or password",401));
    }

    // this will check whether the password is correct or not
    const passwordCheck = await user.comparePassword(password);
    if(!passwordCheck){
        return next(new ErrorHandler("Invalid email or password",401));
    }
    sendToken(user,200,res)
})


// logout a user

exports.logout = catchAsyncError(async(req,res,next)=>{
    res.cookie("token",null,
    {expires:new Date(Date.now()),httpOnly:true}
    )
    res.status(200).json({
        success:true,
        message:"Logged out"
    })
})

// Forgot Password

exports.forgotPassword = catchAsyncError(async (req,res,next)=>{
    const user = await User.findOne({email:req.body.email});
    if(!user)
    {
        return next(new ErrorHandler("User not found",404))
    }

    // Reset password token from user model
    const resetToken = user.getResetPasswordToken()
    
    await user.save({validateBeforeSave:false})

    // Generating a link for reset password

    const resetPasswordUrl = `${req.protocol}://${req.get(
        "host"
    )}/password/reset/${resetToken}`

    // This message will be sent to customer's email
    const message = `Your password reset Token is : \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then , Please ignore it.`;

    try{
        await sendEmail({
            email:user.email,
            subject:'Ecommerce Password Recovery',
            message
        });

        res.status(200).json({
            success:true,
            message:`Message sent to ${user.email} Successfully`
        })

    }catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave:false})
        return next(new ErrorHandler(error.message,500))
    }
})

// Reset password

exports.resetPassword = catchAsyncError(async(req,res,next)=>{

    // Creating a hash for token
    const resetPasswordToken = crypto.createHash("sha256")
                                        .update(req.params.token)
                                        .digest("hex")
    
    // here params.token means it will access from the http url

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    })
    if(!user)
    {
        return next(new ErrorHandler("Reset password token is invalid or has been expired",404))
    }
    if(req.body.password!== req.body.confirmPassword)
    {
        return next(new ErrorHandler("Password Doesn't matches",400))
    }

    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user,200,res)

})


//  Get User Details
exports.getUserDetails = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user
    })
})


// Update user Password

exports.updatePassword = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password");

    const passwordCheck = await user.comparePassword(req.body.oldPassword);
    if(!passwordCheck){
        return next(new ErrorHandler("Old password is incorrect",400));
    }
    
    if(req.body.newPassword !== req.body.confirmPassword)
    {
        return next(new ErrorHandler("Password doesn't Matches",400))
    }
    user.password = req.body.newPassword;
    await user.save();
    sendToken(user,200,res);
})


// Update user Profile
exports.updateProfile = catchAsyncError(async(req,res,next)=>{
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
    };

    // We will be avatar update here
    if(req.body.avatar!=="")
    {
        const user=await User.findById(req.user.id);
        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId)
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder:"avatars", // this is folder from CLOUDINARY WEBSITE
            width:150,
            crop:"scale"
        })

        newUserData.avatar={
            public_id:myCloud.public_id,
            url:myCloud.secure_url
        }
    }



    
    const user = await User.findByIdAndUpdate(req.user.id , newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true
    })
})

     
// Get All Users  -- ADMIN ONLY
exports.getAllUsers = catchAsyncError(async(req,res,next)=>{
    const users = await User.find();

    res.status(200).json({
        success:true,
        users,
    })
})


// Get Single User details   -- ADMIN ONLY
exports.getSingleUser = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.params.id);

    if(!user)
    {
        return next(new ErrorHandler(`User doesn't exists With id : ${req.params.id}`))
    }

    res.status(200).json({
        success:true,
        user
    })
})



// Update User Role  -- ADMIN ONLY
exports.updateUserRole = catchAsyncError(async(req,res,next)=>{
    const newUserData ={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    if(!user)
    {
        return next(new ErrorHandler(`User Doesn't exists with ID: ${req.params.id}`,400))
    }
    res.status(200).json({
        success:true,
    })

})

// Delete User -- ADMIN ONLY
exports.deleteUser = catchAsyncError(async(req,res,next)=>{
    const user = await User.findByIdAndDelete(req.params.id)

    // We will remove the cloudinary Avatat later

    if(!user)
    {
        return next(new ErrorHandler(`User Doesn't exists with ID: ${req.params.id}`,400))
    }
    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);
    
    await user.deleteOne();

    res.status(200).json({
        success:true,
        message:"User deleted Succefully"
    })

})

