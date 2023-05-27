import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema, model } = mongoose;

const restaurantSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    phone: {
      type: Number,
      unique: true,
    },
    image: {
      type: String,
    },
  },
  {
    collection: "restaurants",
  }
);

restaurantSchema.plugin(mongoosePaginate);

const Restaurant = model("Restaurant", restaurantSchema);
export default Restaurant;
