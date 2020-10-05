const Product = require('../Models/Product');
const asyncHandler = require('../Middleware/asyncHandler');
const ErrorResponse = require('../Middleware/ErrorResponse');
const path = require('path')

exports.getAllProducts = asyncHandler(async(req,res,next)=>{
    
    const reqQuery= {...req.query}
    let query;
    const removeFields = ['select', 'sort', 'page', 'limit']

    removeFields.forEach(param=>delete reqQuery[param])
    
    
    query = Product.find(reqQuery);
    

    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query.select(fields);
    }

    if(req.query.sort){
        const fields = req.query.sort.split(',').join(' ');
        query.sort(fields);
    }

    const page = parseInt(req.query.page, 10)||1;
    const limit = parseInt(req.query.limit, 10)||10;
    const skip = (page-1)*limit;
    const total = await Product.countDocuments(reqQuery);
    const totalPages= Math.ceil(total/limit)

    query = query.skip(skip).limit(limit);

    const products = await query;
    
    if(!products){
        return next(new ErrorResponse('No products found', 400))
    }
    res.status(200).json({success: true, data: products, pages: totalPages});
})

exports.getProduct = asyncHandler(async(req,res,next)=>{

    const product = await Product.findById(req.params.id).populate({path: 'user', select: 'username'} );
    
    if(!product){
        return next(new ErrorResponse(`No product found with id ${req.params.id}`, 400))
    }
    res.status(200).json({success: true, data: product});

})

exports.createProduct = asyncHandler(async(req,res,next)=>{
    req.body.user = req.user._id;
    const product = await Product.create(req.body);
    if(!product){
        return next(new ErrorResponse('Could not create product',400))
    }
    res.status(201).json({success: true, data: product})

})

exports.deleteProduct = asyncHandler(async(req,res,next)=>{

    

    let product = await Product.findById(req.params.id);
    
    if(req.user._id.toString()!==product.user.toString()&& req.user.role!=='admin'){
        return next(new ErrorResponse('This product doesnt belong to you', 403))
    }
    if(!product){
        return next(new ErrorResponse(`No product found with id ${req.params.id}`, 400))
    }
    product = await Product.findByIdAndRemove(req.params.id);
    res.status(200).json({success: true, data: product})

})

exports.updateProduct = asyncHandler(async(req,res,next)=>{

    let product = await Product.findById(req.params.id);
    
    if(req.user._id.toString()!==product.user.toString()&& req.user.role!=='admin'){
        return next(new ErrorResponse('This product doesnt belong to you', 403))
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body);
    if(!product){
        return next(new ErrorResponse(`No product found with id ${req.params.id}`, 400))
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({success: true, data: product})

})

exports.fileUpload = asyncHandler(async(req,res,next)=>{

    const product = Product.findById(req.params.id)

    if(!product){
        return next(new ErrorResponse('product doesnt exist', 400))
    }

    
    if(!req.files){
        return next(new ErrorResponse('please upload a file', 400))
    }

    file = req.files.file
    

    if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse('please upload an image', 400))
    }


    file.name = `photo_${req.params.id}${path.parse(file.name).ext}`



    file.mv(`public/uploads/${file.name}`,async(err)=>{
        if(err){
            console.log(err)
        }
        await Product.findByIdAndUpdate(req.params.id, {photo: file.name})
        
    })

    res.status(200).json({success: true})

})