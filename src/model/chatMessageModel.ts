import mongoose from "mongoose";
import { Message } from "@/model/types/types";

const { Schema } = mongoose;

const messageSchema = new Schema<Message>(
  {
    chatroomId: {
      type: Schema.Types.ObjectId,
      ref: "Chatroom",
      required: false,
    },
    messageText: {
      type: String,
      // trim: true,
      required: false,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const MessageModel =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

export default MessageModel;
