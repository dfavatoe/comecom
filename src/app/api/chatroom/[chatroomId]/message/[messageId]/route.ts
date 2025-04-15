import dbConnect from "@/app/lib/dbConnect";
import { auth } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import MessageModel from "@/model/chatMessageModel"; // Dein Message Model

// PUT api/chatroom/[chatroomId]/message/[messageId] - Bearbeitet eine Nachricht
export async function PUT(req: NextRequest) {
  //const { chatroomId, messageId } = req.params; // Hole chatroomId und messageId aus der URL
  // app/api/chatroom/[chatroomId]/message/[messageId].ts
  const url = new URL(req.url);
  const chatroomId = url.pathname.split("/")[3]; // Extrahiere chatroomId aus der URL
  const messageId = url.pathname.split("/")[5]; // Extrahiere messageId aus der URL

  await dbConnect();

  const session = await auth(); // auth() gibt die Session zurück
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { messageText } = await req.json(); // Hole den neuen Nachrichtentext aus der Anfrage
    const updatedMessage = await MessageModel.findByIdAndUpdate(
      messageId,
      { messageText }, // Update den Nachrichtentext
      { new: true } // Gibt die aktualisierte Nachricht zurück
    );
    if (!updatedMessage) {
      return new NextResponse("Nachricht nicht gefunden", { status: 404 });
    }
    return new NextResponse(JSON.stringify(updatedMessage), { status: 200 });
  } catch (error) {
    return new NextResponse("Fehler beim Bearbeiten der Nachricht", {
      status: 500,
    });
  }
}

// DELETE api/chatroom/[chatroomId]/message/[messageId] - Löscht eine Nachricht
export async function DELETE(req: NextRequest) {
  //const { chatroomId, messageId } = req.params; // Hole chatroomId und messageId aus der URL
  const url = new URL(req.url);
  const chatroomId = url.pathname.split("/")[3]; // Extrahiere chatroomId aus der URL
  const messageId = url.pathname.split("/")[5]; // Extrahiere messageId aus der URL
  await dbConnect();

  const session = await auth(); // auth() gibt die Session zurück
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const deletedMessage = await MessageModel.findByIdAndDelete(messageId); // Lösche die Nachricht anhand der ID
    if (!deletedMessage) {
      return new NextResponse("Nachricht nicht gefunden", { status: 404 });
    }
    return new NextResponse("Nachricht gelöscht", { status: 200 });
  } catch (error) {
    return new NextResponse("Fehler beim Löschen der Nachricht", {
      status: 500,
    });
  }
}
