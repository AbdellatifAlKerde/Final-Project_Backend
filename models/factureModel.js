import mongoose from "mongoose";
const { Schema, model } = mongoose;
import mongoosePaginate from "mongoose-paginate-v2";

const factureSchema = new Schema(
  {
    user: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    order: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    total: {
      type: Number,
    },
  },
  {
    collection: "factures",
  }
);

factureSchema.plugin(mongoosePaginate);
factureSchema.pre(["find", "findOne"], function () {
  this.populate("user");
});

factureSchema.pre(["find", "findOne"], function () {
  this.populate("order");
});

const Facture = model("Facture", factureSchema);
export default Facture;
