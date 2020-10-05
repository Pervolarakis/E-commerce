const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a course title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  photo: {
    type: String,
    default: "empty.jpg"
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  condition: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});


module.exports = mongoose.model('Product', ProductSchema);
