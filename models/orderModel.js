import mongoose from "mongoose";
const { Schema, model } = mongoose;
import mongoosePaginate from "mongoose-paginate-v2";

const orderSchema = new Schema(
  {
    user: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    restaurants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
      },
    ],
  },
  {
    collection: "orders",
  }
);

orderSchema.plugin(mongoosePaginate);
orderSchema.pre(["find", "findOne"], function () {
  this.populate("user");
});

orderSchema.pre(["find", "findOne"], function () {
  this.populate("restaurants");
});

const Order = model("Order", orderSchema);
export default Order;
