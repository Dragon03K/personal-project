import mongoose from "mongoose";

const InfluencerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    instagramId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Influencer ||
  mongoose.model("Influencer", InfluencerSchema);
