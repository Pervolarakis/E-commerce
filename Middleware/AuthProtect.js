const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('./ErrorResponse');
const User = require('../Models/User')

exports.protect = asyncHandler(async(req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token){
        return next(new ErrorResponse('Not logged in', 403))
    }
    try{
        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id);
        next();
    }catch(err){
        return next(new ErrorResponse(err, 403))
    }
})