import mongoose from 'mongoose';
var userSchema = mongoose.Schema({
    name:{"type":String,require:true},
    emailid:{"type":String,required:true,unique:true},
    password:{"type":String,required:true},
    address:{"type":String,required:true},
    phonenumber:{"type":Number,required:true,unique:true},
    role:{"type":String,default:"user"}

},{ timestamps: true })
export default mongoose.model("user",userSchema)
