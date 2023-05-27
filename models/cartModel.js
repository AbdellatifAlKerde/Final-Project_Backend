import mongoose from "mongoose";

const { Schema, model } = mongoose;

const cartSchema = new Schema(
  {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },

        price: {
          type: Number,
        },
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: "Cart",
  }
);

cartSchema.pre(["find", "findOne"], function () {
  this.populate("products.productId");
});

cartSchema.pre(["find", "findOne"], function () {
  this.populate("userId");
});

const Cart = model("Cart", cartSchema);
export default Cart;
