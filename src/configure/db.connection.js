import mongoose from "mongoose";
const pool = () => {
    mongoose.Promise = global.Promise;
    // mongodb+srv://admin:ADMIN@123@cluster0.csatt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

    // const uri = "mongodb+srv://admin:Admin123@cluster0.csatt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Force IPv4
    const uri  = "mongodb+srv://ajaysikata:GU80tm41ONEGfXVO@cluster0.rmv36.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    //    const uri  = "mongodb://localhost:27017/backendforkabira?retryWrites=true&w=majority"
    const options = {
        useNewUrlParser: true,    // Nai URL parsing engine use karne ke liye.
        useUnifiedTopology: true, // Nai server discovery and monitoring engine ke liye.
        serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
    };

    mongoose
        .connect(uri, options)
        .then(() => console.log("MongoDB connected successfully"))
        .catch((err) => console.error("MongoDB connection error:", err));
};

export default pool;
