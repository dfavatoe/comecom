import dbConnect from "@/app/lib/dbConnect";
import { auth } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server"; // Verwende NextRequest und NextResponse
import ChatroomModel from "@/model/chatroomModel"; // Dein Chatroom Model
import MessageModel from "@/model/chatMessageModel";

// GET api/chatroom/[chatroomId] - Gibt einen einzelnen Chatroom zurück
//export async function GET(req: NextRequest) {
//   const { chatroomId } = req.params; // Hole die chatroomId aus der URL
// const url = new URL(req.url);
// const chatroomId = url.pathname.split("/")[3]; // Der chatroomId befindet sich an Position 3 in der URL (z.B. /api/chatroom/:chatroomId)

export async function GET(
  req: NextRequest,
  { params }: { params: { chatroomId: string; messageId: string } }
) {
  const { chatroomId, messageId } = params;

  await dbConnect();

  const session = await auth(); // auth() gibt die Session zurück
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 }); // Falls keine Session oder User vorhanden ist
  }

  try {
    const chatroom = await ChatroomModel.findById(chatroomId); // Finde den Chatroom anhand der ID
    if (!chatroom) {
      return new NextResponse("Chatroom nicht gefunden", { status: 404 });
    }
    // Die eine Nachricht holen
    const message = await MessageModel.findOne({
      _id: messageId,
      chatroomId: chatroomId,
    });

    if (!message) {
      return new NextResponse("Nachricht nicht gefunden", { status: 404 });
    }

    return NextResponse.json(message);
  } catch (error) {
    console.log(error);
    return new NextResponse("Fehler beim Abrufen des Chatrooms", {
      status: 500,
    });
  }
}

// DELETE api/chatroom/[chatroomId] - Löscht einen Chatroom
// export async function DELETE(req: NextRequest) {
//   //const { chatroomId } = req.params; // Hole die chatroomId aus der URL
//   const url = new URL(req.url);
//   const chatroomId = url.pathname.split("/")[3]; // Der chatroomId befindet sich an Position 3 in der URL (z.B. /api/chatroom/:chatroomId)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { chatroomId: string } }
) {
  const { chatroomId } = params;
  await dbConnect();

  const session = await auth(); // auth() gibt die Session zurück
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const deletedChatroom = await ChatroomModel.findByIdAndDelete(chatroomId); // Lösche den Chatroom anhand der ID
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
