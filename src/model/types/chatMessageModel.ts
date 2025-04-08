import mongoose, { mongo } from "mongoose";
import { Message, Chat, UserFull } from "@/model/types/types";

const { Schema } = mongoose;

const messageSchema = new Schema<Message>(
  {
    chatroomId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: false,
      },
    ],
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    text: {
      type: String,
      trim: true,
      required: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const MessageModel =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

export default MessageModel;
