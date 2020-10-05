const asyncHandler = require('../Middleware/asyncHandler');
const ErrorResponse = require('../Middleware/ErrorResponse');
const User = require('../Models/User');

exports.registerUser = asyncHandler(async(req,res,next)=>{
    const {fname, lname, username, email, password} = req.body;
    const user = await User.create({
        fname,
        lname,
        email,
        username,
        password
    })
    const token = user.getJwtToken();
    res.status(200).json({success: true, user: user, token: token})
})

exports.loginUser = asyncHandler(async(req,res,next)=>{
    
    const {email, password} = req.body;

    if(!email||!password){
        return next(new ErrorResponse('please fill all the fields', 401))
    }

    const user = await User.findOne({email}).select('+password');

    if(!user){
        return next(new ErrorResponse('invalid login credentials', 401));
    }

    const isMatch = await user.comparePasswords(password);

    if(!isMatch){
        return next(new ErrorResponse('invalid login credentials', 401))
    }

    const token = user.getJwtToken();
    const userInfo = await User.findOne({email})
    
    res.status(200).json({success: true, user: userInfo, token: token})

    

})