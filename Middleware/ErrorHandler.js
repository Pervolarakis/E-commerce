const ErrorResponse = require('./ErrorResponse');


const ErrorHandler = (err,req,res,next) =>{
    
    let error = {...err}
    
    error.message = err.message

    if(err.name==='CastError'){
        error = new ErrorResponse('wrong id format', 404);
    }
    if(err.code==11000){
        error= new ErrorResponse("duplicate key", 404)
    }
    console.log(error);
    res.status(error.statusCode || 500).json(error.message);

}

module.exports = ErrorHandler;