module.exports = (theFunc) =>(req,res,next)=>{
    // this will work as try catch in async functions
    Promise.resolve(theFunc(req,res,next)).catch(next);
}