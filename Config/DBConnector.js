const mongoose = require('mongoose');

const connectDB = async()=>{
    const conn = await mongoose.connect(process.env.DBURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
    console.log('connected to db')
}

module.exports = connectDB;