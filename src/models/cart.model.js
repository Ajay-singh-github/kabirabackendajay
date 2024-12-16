
import mongoose from 'mongoose';

var cartSchema = mongoose.Schema(
  {
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    cart:[{productid:{type: mongoose.Schema.Types.ObjectId, ref:"product",required:true},
      quantity:{type: Number,required:true ,default:1}
    }]
  },
  { timestamps: true }
);

export default mongoose.model("cart", cartSchema);
