import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema, model } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  },
  {
    collection: "categories",
  }
);

categorySchema.plugin(mongoosePaginate);

const categoryModel = model("category", categorySchema);

export default categoryModel;
