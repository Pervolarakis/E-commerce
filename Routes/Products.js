const express = require('express');
const router = express.Router();
const {getAllProducts,getProduct,createProduct,updateProduct,deleteProduct,fileUpload} = require('../Controllers/ProductsController')
const {protect} = require('../Middleware/AuthProtect'); 
const { route } = require('./Auth');


router.route('/').get(getAllProducts).post(protect,createProduct);
router.route('/upload/:id').put(fileUpload);
router.route('/:id').get(getProduct).put(protect,updateProduct).delete(protect,deleteProduct);


module.exports = router;