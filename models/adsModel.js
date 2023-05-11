import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema, model } = mongoose;

const adsSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    image: {
      type: String,
    },
  },
  {
    collection: "Ads",
  }
);

adsSchema.plugin(mongoosePaginate);

const Ads = model("Ads", adsSchema);
export default Ads;
