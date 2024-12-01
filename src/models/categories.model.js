import mongoose from 'mongoose';
var categoriesSchema = mongoose.Schema({
    name:{"type":String,require:true},
    image:{"type":String,require:true}

},{ timestamps: true })
export default mongoose.model("categories",categoriesSchema)
