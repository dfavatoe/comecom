import dbConnect from "@/app/lib/dbConnect";
import { auth } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import ChatroomModel from "@/model/chatroomModel";
import MessageModel from "@/model/chatMessageModel";

export async function GET(
  req: NextRequest,
  { params }: { params: { chatroomId: string } }
) {
  const { chatroomId } = params;

  await dbConnect();

  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const chatroom = await ChatroomModel.findById(chatroomId);
    if (!chatroom) {
      return new NextResponse("Chatroom nicht gefunden", { status: 404 });
    }
    const messages = await MessageModel.find({
      chatroomId: chatroomId,
    }).sort({ createdAt: 1 });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Fehler beim Abrufen der Nachrichten:", error);
    return new NextResponse("Fehler beim Abrufen der Nachrichten", {
      status: 500,
    });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { chatroomId: string } }
) {
  const { chatroomId } = params;
  await dbConnect();

  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const deletedChatroom = await ChatroomModel.findByIdAndDelete(chatroomId);
    if (!deletedChatroom) {
      return new NextResponse("Chatroom nicht gefunden", { status: 404 });
    }
    return new NextResponse("Chatroom gelöscht", { status: 200 });
  } catch (error) {
    return new NextResponse("Fehler beim Löschen des Chatrooms", {
      status: 500,
    });
  }
}
