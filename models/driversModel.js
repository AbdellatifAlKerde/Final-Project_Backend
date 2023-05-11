import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema, model } = mongoose;

const driverSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },
    phone: {
      type: Number,
      required: [true, "Email is required"],
      unique: true,
    },
    status: {
      type: String,
      enum: ["pending", "delivered"],
      default: "pending",
    },
  },
  {
    collection: "drivers",
  }
);

driverSchema.plugin(mongoosePaginate);

const Driver = model("Driver", driverSchema);
export default Driver;
