import dbConnect from "@/app/lib/dbConnect";
import { auth } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import ChatroomModel from "@/model/chatroomModel";
import MessageModel from "@/model/chatMessageModel";

function extractChatroomId(req: NextRequest): string | null {
  const parts = req.nextUrl.pathname.split("/");
  return parts[3] || null; // e.g. /api/chatroom/123/message → "123"
}

export async function GET(req: NextRequest) {
  const chatroomId = extractChatroomId(req);
  if (!chatroomId) {
    return new NextResponse("Chatroom ID missing", { status: 400 });
  }

  await dbConnect();

  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const chatroom = await ChatroomModel.findById(chatroomId);
    if (!chatroom) {
      return new NextResponse("Chatroom not found", { status: 404 });
    }

    const messages = await MessageModel.find({ chatroomId }).sort({
      createdAt: 1,
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error getting messages:", error);
    return new NextResponse("Error getting messages", { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const chatroomId = extractChatroomId(req);
  if (!chatroomId) {
    return new NextResponse("Chatroom ID missing", { status: 400 });
  }

  await dbConnect();

  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const deletedChatroom = await ChatroomModel.findByIdAndDelete(chatroomId);
    if (!deletedChatroom) {
      return new NextResponse("Chatroom not found", { status: 404 });
    }

    return new NextResponse("Chatroom successfully deleted", { status: 200 });
  } catch (error) {
    console.error("Error deleting chatroom:", error);
    return new NextResponse("Error deleting chatroom", { status: 500 });
  }
}
