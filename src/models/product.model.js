import mongoose from 'mongoose';
var productSchema = mongoose.Schema({
    categoryid:{"type":mongoose.Schema.Types.ObjectId,Ref:"categories",require:true},
    name:{"type":String,required:true},
    description:{"type":String,required:true},
    sku:{"type":String,required:true},
    stockquantity:{"type":Number,required:true},
    regularrprice:{"type":Number,required:true},
    saleprice:{"type":Number,required:true},
    tags:{"type":String,required:true},
    image:{"type":String,required:true}

},{ timestamps: true })
export default mongoose.model("product",productSchema)
