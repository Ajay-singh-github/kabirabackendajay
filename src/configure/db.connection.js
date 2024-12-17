import mongoose from "mongoose";

const pool = () => {
    mongoose.Promise = global.Promise;

    const uri = "mongodb://127.0.0.1:27017/backendforkabira"; // Force IPv4
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
