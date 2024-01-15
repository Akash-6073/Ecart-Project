// class 1st letter should be always capital here we are inheriting the Error class which is inbuilt

class ErrorHandler extends  Error{

// from productController we have given message and status so pass it in constructor

    constructor(message,statusCode){  
            super(message);
            this.statusCode=statusCode

            // so this line will catch the error
            Error.captureStackTrace(this,this.constructor)  
        }
}

module.exports=ErrorHandler