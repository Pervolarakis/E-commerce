const express = require('express');
const app = express();
const cors = require('cors')
const path = require('path')
const fileupload = require('express-fileupload');

app.use(cors({origin: true}))
app.use(fileupload())
const ProductsRouter = require('./Routes/Products');
const AuthRouter = require('./Routes/Auth');
const UserRouter = require('./Routes/User');
const dotenv = require('dotenv')
const connectDB = require('./Config/DBConnector');
const ErrorHandler = require('./Middleware/ErrorHandler')





dotenv.config({path: './Config/config.env'});
app.use(express.static(path.join(__dirname, 'public')))
connectDB();
app.use(express.json());
app.use('/api/v1/products',ProductsRouter);
app.use('/api/v1/auth', AuthRouter);
app.use('/api/v1/user', UserRouter)
app.use(ErrorHandler);

app.listen(5000);