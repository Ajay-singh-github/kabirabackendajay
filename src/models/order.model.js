import mongoose from 'mongoose';
var orderSchema = mongoose.Schema({
    userid:{type:mongoose.Schema.Types.ObjectId,ref:"usera",require:true},
    items:[],
    totalamount:{'type':Number} ,
    orderstatus:{"type":String ,enum: ['pending', 'completed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],default: 'pending',required: true},
    paymentid:{type:mongoose.Schema.Types.ObjectId,ref:"payment",required:true},
    shippingid:{type:mongoose.Schema.Types.ObjectId,ref:"shippingaddress",required:true}
},{ timestamps: true })
export default mongoose.model("order",orderSchema)
