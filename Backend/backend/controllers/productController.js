const Product = require('../models/productModel')
const ErrorHandler = require('../utils/errorhandler')
const catchAsyncError = require('../middleware/catchAsyncError')  // this works as try catch for async functions
const ApiFeatures = require('../utils/apifeatures')
const cloudinary = require('cloudinary')

//  Create a Product  -- Admin only

exports.createProduct = catchAsyncError(async(req,res,next)=>{

    //  Here we will be adding images from frontend
    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
  
    const imagesLinks = [];
  
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });
  
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  
    req.body.images = imagesLinks;
    req.body.user = req.user.id;

    const product = await Product.create(req.body)
    res.status(201).json({
        success:true,
        product
    })
})


// Get All Products
exports.getAllProducts = catchAsyncError(async(req,res,next)=>{
    // return next(new ErrorHandler("This is temp error",500))
    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();
    const apifeature = new ApiFeatures(Product.find(),req.query)
     .search()
     .filter();

     let products = await apifeature.query.clone();

     let filteredProductsCount = products.length;
 
     apifeature.pagination(resultPerPage);

    products = await apifeature.query;
    res.status(200).json({
        success:true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount
    })
}
)

// Get All Admin Products
exports.getAdminProducts = catchAsyncError(async(req,res,next)=>{
    const products = await Product.find();
    res.status(200).json({
        success:true,
        products,
    })
}
)

// get single Product Details
exports.getProductDetails = catchAsyncError(async(req,res,next)=>{
    let product = await Product.findById(req.params.id)
    if(!product)
    {
        return next(new ErrorHandler("Product not found",404))
    }
    res.status(200).json({
        success:true,
        product
    })
})


// Update a Product  --Admin only
exports.updateProduct = catchAsyncError(async(req,res,next)=>{
    let product = await Product.findById(req.params.id)  // req.params.id helps fetch the product with that number from a database.
    // if(!product)
    // {
    //     return res.status(500).json({
    //         success:false,
    //         message:"Product not found"
    //     })
    // }
    if(!product)
    {
        return next(new ErrorHandler("Product not found",404))

    }



    // Images Starts here 
    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    if (images !== undefined) {
        // Deleting Images From Cloudinary
        for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }

        const imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
        }

        req.body.images = imagesLinks;
    }
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    // { new: true, runValidators: true, useFindAndModify: false }: These are options typically used when updating a resource. new: true returns the modified document, runValidators: true ensures data validation, and useFindAndModify: false opts for a more modern method for updates.
    res.status(200).json({
        success:true,
        product
    })
})


// Delete a Product -- Admin Only
exports.deleteProduct=catchAsyncError(async(req,res,next)=>{
    let product = await Product.findById(req.params.id)
    // if(!product)
    // {
    //     return res.status(500).json({
    //         success:false,
    //         message:"Product not found"
    //     })
    // }
    if(!product)
    {
        return next(new ErrorHandler("Product not found",404))

    }


    // Deleting images from cloudinary
    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }





    await product.deleteOne()
    res.status(200).json({
        success:true,
        message:"Product Deleted Successfully"
    })
})




//  Create a review or update a review
exports.createProductReview = catchAsyncError(async (req,res,next)=>{
        const {rating , comment, productId }= req.body;
        const review = {
            user:req.user._id,
            name:req.user.name,
            rating:Number(rating),
            comment
        }

        const product = await Product.findById(productId)
        
        const isReviewed = product.reviews.find( 
            (rev) => rev.user.toString() === req.user._id.toString() 
        )
        if(isReviewed)
        {
            product.reviews.forEach((rev)=>{
                if(rev.user.toString() === req.user._id.toString())
                {
                    rev.rating=rating,
                    rev.comment=comment
                }
            })
        }
        else{
            // this will push that reviews directly in product model
            product.reviews.push(review)
            product.numOfReviews = product.reviews.length
        }

        let avg = 0;
        product.reviews.forEach((rev)=>{
            avg+=rev.rating;
        }) 
        product.ratings = avg/ product.reviews.length;
        await product.save({validateBeforeSave:false})

        res.status(200).json({
            success:true
        })
})


//  Get all reviews of a product
exports.getProductReviews = catchAsyncError(async(req,res,next)=>{
    const product = await Product.findById(req.query.id);  // query is saved in ApiFeature.js file
    if(!product)
    {
        return next(new ErrorHandler("Product not found",404));
    }
    res.status(200).json({
        success:true,
        reviews:product.reviews,
    })
})


// Delete Product review
exports.deleteReview = catchAsyncError(async(req,res,next)=>{
    const product = await Product.findById(req.query.productId); // query is saved in ApiFeature.js file
    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    // This will skip and filter the review which we want to delete
    const reviews  = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
    )
    
    //  We need to update ratings and no. of reviews also 
    let avg=0;
    reviews.forEach((rev)=>{
        avg+=rev.rating
    })

    let ratings = 0;

    if (reviews.length === 0) {
      ratings = 0;
    } else {
        ratings =avg/reviews.length;
    }
    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId,
        {
        reviews,
        ratings,
        numOfReviews
        },{
        new:true,
        runValidators:true,
        useFindAndModify:false
        }
    )


    res.status(200).json({
        success:true,
    })
})