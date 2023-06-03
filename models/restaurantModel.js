import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema, model } = mongoose;

const restaurantSchema = new Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
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
    image: {
      type: String,
    },
  },
  {
    collection: "restaurants",
  }
);

restaurantSchema.plugin(mongoosePaginate);

restaurantSchema.pre(["find", "findOne"], function () {
  this.populate("admin");
});

const Restaurant = model("Restaurant", restaurantSchema);
export default Restaurant;
