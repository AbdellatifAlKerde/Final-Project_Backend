import mongoose from "mongoose";
const { Schema, model } = mongoose;
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new Schema(
  {
    name: { type: String },
    description: { type: String },
    price: { type: Number },
    image: { type: String },
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
  },
  {
    collection: "products",
  }
);

productSchema.plugin(mongoosePaginate);
productSchema.pre(["find", "findOne"], function () {
  this.populate("restaurant_id");
});

productSchema.pre(["find", "findOne"], function () {
  this.populate("category");
});

const Product = model("Product", productSchema);
export default Product;
