const User = require('../Models/User');
const asyncHandler = require('../Middleware/asyncHandler');
const ErrorResponse = require('../Middleware/ErrorResponse');

exports.getAllUser = asyncHandler(async(req,res,next)=>{
    
    if(req.user.role!=='admin'){
        return next(new ErrorResponse('You dont have permission',403))
    }
    const users = await User.find();
    res.status(200).json({success: true, data:users})
})

exports.getUser = asyncHandler(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    res.status(200).json({success: true, data:user})
})

exports.deleteUser = asyncHandler(async(req,res,next)=>{
    
    if(req.params.id.toString()!==req.user._id.toString() && req.user.role!=='admin'){
        return next(new ErrorResponse('You dont have permission',403))
    }
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({success: true, data:user})
})

exports.updateUser = asyncHandler(async(req,res,next)=>{
    
    const {fname, lname} = req.body;
    if(req.params.id.toString()!==req.user._id.toString() && req.user.role!=='admin'){
        return next(new ErrorResponse('You dont have permission',403))
    }
    const user = await User.findByIdAndUpdate(req.params.id,{fname,lname},{
        new: true,
        runValidators: true
    });
    res.status(200).json({success: true, data:user})
})

exports.updatePassword = asyncHandler(async(req,res,next)=>{

    const {email, oldPassword, newPassword} = req.body;
    let user = await User.findOne({email}).select('+password');
    
    if(user._id.toString()!==req.user._id.toString() && req.user.role!=='admin'){
        return next(new ErrorResponse('You dont have permission',403))
    }
    const isMatch = await user.comparePasswords(oldPassword);
    if(!isMatch){
        return next(new ErrorResponse('incorrect password', 401))
    }
    user.password = newPassword;
    await user.save()
    res.status(200).json({success: true, data:user})

})

exports.getMe = asyncHandler(async(req,res,next)=>{
    res.status(200).json({success: true, user: req.user})

})
