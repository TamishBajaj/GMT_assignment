const express = require('express');
const cors=require('cors')
const mongoose = require('mongoose');
const connectDB=require('./db/connect')
const clockRoutes=require('./routes/clockRoute')
const users=require('./routes/auth')

const notFound=require('./middleware/notFound')
const errorHandlerMiddleware=require('./middleware/errorHandler')


const bodyParser = require('body-parser');

// require('dotenv').config()
const app = express();

app.use(cors());

// Middleware
app.use(express.json());

// Routes
app.use('/api/v1/config', clockRoutes);
app.use('/api/v1/users',users)


// When the route doesnot exist
app.use(notFound)
app.use(errorHandlerMiddleware)


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