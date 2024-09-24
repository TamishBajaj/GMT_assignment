import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './db/connect.js';
// import clockRoutes from './routes/clockRoute.js';
// const users=require('./routes/auth')

import userRouter from './routes/user.routes.js';
import cookieParser from 'cookie-parser';

// import notFound from './middleware/notFound.js';
// import errorHandlerMiddleware from './middleware/errorHandler.js'


import bodyParser from 'body-parser';

import dotenv from 'dotenv';
dotenv.config();
const app = express();

app.use(cors({
    // origin: 'http://your-frontend-url.com', // Your frontend's domain
    credentials: true // Allow sending cookies with requests
  }));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
// app.use('/api/v1/config', clockRoutes);
app.use('/api/v1/users',userRouter)




// When the route doesnot exist
// app.use(notFound)
// app.use(errorHandlerMiddleware)


const port=process.env.PORT || 3000;

const start=async()=>{
    try{
        
        await connectDB(process.env.mongoURI)
        app.listen(port,console.log(`Server listening on port ${port} ...`))
    }catch(error){
        console.log(error)
    }

}

start();