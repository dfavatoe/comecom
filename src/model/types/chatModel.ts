import mongoose, { mongo } from "mongoose";
import { Chat } from "@/model/types/types";

const { Schema } = mongoose;

const chatSchema = new Schema<Chat>(
  {
    chatroomId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: false,
      },
    ],
    messageText: {
      type: String,
      required: false,
    },
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: false,
    },
    sender: {
      type: String,
      required: false,
    },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    // role: {
    //   type: String,
    //   enum: ["buyer", "seller"], //a set of related values with descriptive names, often used to represent fixed options
    //   default: "buyer",
    //   required: true,
    // },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const ChatModel = mongoose.models.Chat || mongoose.model("Chat", chatSchema);

export default ChatModel;
