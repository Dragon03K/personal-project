import mongoose from "mongoose";

const BusinessSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: [true, "Contact Number is required"],
      unique: true,
      min: [10, "Contact Number must be 10 digits"],
      max: [10, "Contact Number must be 10 digits"],
    },
    address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Business ||
  mongoose.model("Business", BusinessSchema);
