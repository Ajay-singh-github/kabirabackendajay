import mongoose from "mongoose";
var pool =()=>{
    mongoose.Promise = global.Promise;

    var options={}
    // mongodb+srv://admin:ADMIN@123@cluster0.csatt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
    mongoose.connect(`mongodb+srv://admin:Admin123@cluster0.csatt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,options);

    mongoose.connection.once("open",()=>console.log("mongodb running")).on("error",(err)=>console.log(err));

};

export default pool;