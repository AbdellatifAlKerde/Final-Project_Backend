import mongoose from "mongoose";
import bcrypt from "bcrypt";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema, model } = mongoose;

const adminSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
    },
    password: { type: String, required: true },
    isSuper: { type: Boolean, required: true },
    isActive: { type: Boolean, default: true },
  },
  {
    collection: "admins",
  }
);

adminSchema.plugin(mongoosePaginate);

adminSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
});

adminSchema.methods.isValidPassword = async function (password) {
  try {
    console.log(this.password);
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

const Admin = model("Admin", adminSchema);
export default Admin;
