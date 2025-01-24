import mongoose from 'mongoose';

//connects to moongoose either via MongoDB Atlas or MongoDB Compass
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shift-report');

export default mongoose.connection;
