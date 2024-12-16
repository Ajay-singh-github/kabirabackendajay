import mongoose from 'mongoose';
var orderSchema = mongoose.Schema({
    userid:{type:mongoose.Schema.Types.ObjectId,Ref:"usera",require:true},
    items:[],
    totalamount:{'type':Number} ,
    orderstatus:{"type":String ,enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],default: 'pending',required: true},
    paymentid:{type:mongoose.Schema.Types.ObjectId,Ref:"payment",required:true}
    
},{ timestamps: true })
export default mongoose.model("order",orderSchema)
