import mongoose from 'mongoose';
var cartSchema = mongoose.Schema({
    userid:{"type":mongoose.Schema.Types.ObjectId,Ref:"user",require:true},
    category:{"type":String,enum:["cart","list"],required:true},
    productid:{"type":mongoose.Schema.Types.ObjectId,Ref:'product',required:true}

},{ timestamps: true })
export default mongoose.model("cart",cartSchema)
