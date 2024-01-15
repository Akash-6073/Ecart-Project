const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require('../utils/errorhandler')
const catchAsyncError = require('../middleware/catchAsyncError') 

// Create a new order
exports.newOrder = catchAsyncError(async(req,res,next)=>{
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id,
    });
    // const product = await Product.findById(order.product)
    // console.log(order.quantity)
    // if(order.quantity>product.Stock)
    // {
    //     return res.status(400).json({
    //         success:false,
    //         messsage:"Order Quantity  exceeded"
    //     })
    // }
    
    res.status(201).json({
        success:true,
        order
    })
}) 


// Get Single Order
exports.getSingleOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id).populate("user","name email");
    // Here ppopulate is used to find the database of that user , so we get name and email of that user

    if(!order)
    {
        return next(new ErrorHandler("Order not found with this ID",404));
    }

    res.status(200).json({
        success:true,
        order
    })
})


// Get logged in orders
exports.myOrders = catchAsyncError(async(req,res,next)=>{
    const orders = await Order.find({user:req.user._id});

    res.status(200).json({
        success:true,
        orders
    })
})


// Get All orders  -- ADMIN only
exports.getAllOrders = catchAsyncError(async(req,res,next)=>{
    const orders = await Order.find();
    let totalAmount=0;

    orders.forEach((order)=>{
        totalAmount+=order.totalPrice
    })

    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })
})


// Update  order Status  --ADMIN only

exports.updateOrder = catchAsyncError(async(req,res,next)=>{

    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order not found with this ID",404))
    }
    if(order.orderStatus==="Delivered")
    {
        return next(new ErrorHandler("You have already delivered this order",404))
    }

    if( req.body.status==="Shipped")
    {
        order.orderItems.forEach(async (order)=>{
            await updateStock(order.product,order.quantity)
        })
    }

    order.orderStatus = req.body.status;
    if( req.body.status==="Delivered")
    {

        order.deliveredAt = Date.now();
    }

    await order.save({validateBeforeSave:false});

    res.status(200).json({
        success:true
    })

})

async function updateStock(id,quantity){

    const product = await Product.findById(id);

    product.Stock-=quantity;

    await product.save({validateBeforeSave:false});

}


// Delete Order   --- ADMIN Only
exports.deleteOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order not found with this ID",404))
    }
    await order.deleteOne();
    res.status(200).json({
        success:true
    })
})