import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ChatSessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "New Chat",
    },
    messages: [MessageSchema],
    lastMessage: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.models.ChatSession ||
  mongoose.model("ChatSession", ChatSessionSchema);
