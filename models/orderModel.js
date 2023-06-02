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
    products: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
        },
        status: {
          type: String,
          enum: ["pending", "delivered"],
          default: "pending",
        },
      },
    ],
    total: { type: Number },
  },
  {
    collection: "orders",
    timestamps: true,
  }
);

orderSchema.plugin(mongoosePaginate);
orderSchema.pre(["find", "findOne"], function () {
  this.populate("user");
});

orderSchema.pre(["find", "findOne"], function () {
  this.populate("products._id");
});

const Order = model("Order", orderSchema);
export default Order;
