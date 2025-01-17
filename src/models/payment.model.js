
import mongoose from 'mongoose';

var paymentSchema = mongoose.Schema(
  {
    userid:{"type":mongoose.Schema.Types.ObjectId, ref: "usera", required: true},
    paymentmode:{'type':String},
    paymentstatus:{'type': String,enum: ['pending', 'success', 'failed'],default:"pending"},
    paymentamount:{"type":Number},
    transactiondetails:{"type":String},
     orderid:{type:mongoose.Schema.Types.ObjectId,ref:"order",required:true},

  },
  { timestamps: true }
);

export default mongoose.model("payment", paymentSchema);
