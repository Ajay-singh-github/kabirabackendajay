import mongoose from 'mongoose';
var shippingaddressSchema = mongoose.Schema({
    userid:{"type":mongoose.Schema.Types.ObjectId,Ref:"usera",require:true},
    address:{type:Object},

},{ timestamps: true })
export default mongoose.model("shippingaddress",shippingaddressSchema)
