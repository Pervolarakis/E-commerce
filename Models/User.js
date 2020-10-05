
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: [true, 'Please add a first name']
  },
  lname: {
    type: String,
    required: [true, 'Please add a last name']
  },
  username: {
    type: String,
    unique: true,
    required: [true, 'Please add a username']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    default: 'user'
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

UserSchema.pre('save',async function(){
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})

UserSchema.methods.getJwtToken = function(){
  return jwt.sign({id: this._id}, process.env.JWT_SECRET, {expiresIn: '30d'});
}

UserSchema.methods.comparePasswords = async function(enteredPassword){
  return bcrypt.compare(enteredPassword, this.password);
}

module.exports = mongoose.model('User', UserSchema);
