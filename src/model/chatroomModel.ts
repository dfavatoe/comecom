import mongoose from "mongoose";
import { Chatroom } from "@/model/types/types";

const { Schema } = mongoose;

const chatroomSchema = new Schema<Chatroom>(
  {
    messageId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      required: false,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    ],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const ChatroomModel =
  mongoose.models.Chatroom ||
  mongoose.model("Chatroom", chatroomSchema, "chatrooms");

console.log(mongoose.models); // Überprüfen, ob das Modell bereits registriert wurde

export default ChatroomModel;
