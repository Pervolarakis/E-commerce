const express = require('express')
const router = express.Router();
const {protect} = require('../Middleware/AuthProtect')
const {getAllUser,getUser,deleteUser,updateUser,updatePassword, getMe} = require('../Controllers/UserController')

router.route('/').get(protect,getAllUser)
router.route('/changepass').put(protect,updatePassword)
router.route('/getme').get(protect, getMe)
router.route('/:id').get(getUser).delete(protect,deleteUser).put(protect,updateUser);



module.exports = router;