import dbConnect from "@/app/lib/dbConnect";
import { auth } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import MessageModel from "@/model/chatMessageModel";
import UserModel from "@/model/usersModel";

// Creates a new message in the chatroom
export async function POST(
  req: NextRequest,
  { params }: { params: { chatroomId: string } }
) {
  const { chatroomId } = params; // <-- Hier bekommst du die ID korrekt raus
  await dbConnect();

  const session = await auth(); // auth() gibt die Session zurück
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { messageText } = await req.json();

  // Benutzer in der Datenbank suchen, um die ID zu erhalten
  try {
    const user = await UserModel.findById(session.user.id); // Finde den Benutzer anhand der ID in der Session
    if (!user) {
      return new NextResponse(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Erstelle eine neue Nachricht
    const newMessage = new MessageModel({
      chatroomId,
      messageText,
      authorId: user._id, // Setze den Author der Nachricht aus der Datenbank
      authorName: user.name,
    });

    // Speichere die Nachricht
    await newMessage.save();

    return new NextResponse(JSON.stringify(newMessage), { status: 201 });
  } catch (error) {
    console.error("Fehler beim Erstellen der Nachricht:", error);
    return new NextResponse("Fehler beim Erstellen der Nachricht", {
      status: 500,
    });
  }
}

export async function GET(
  req: NextRequest,
  // { params }: { params: { chatroomId: string } }
  context: { params: { chatroomId: string } }
) {
  const { chatroomId } = await context.params;
  await dbConnect();

  const url = new URL(req.url);
  const after = url.searchParams.get("after");

  try {
    const query: Record<string, unknown> = { chatroomId }; //corrected any type to Record

    if (after) {
      const afterDate = new Date(Number(after)); // "after" als Zahl (Zeitstempel)
      query.createdAt = { $gt: afterDate };
    }

    const messages = await MessageModel.find(query).sort({ createdAt: 1 });
    console.log(messages);

    return new NextResponse(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    console.error("Fehler beim Abrufen der Nachrichten:", error);
    return new NextResponse(
      JSON.stringify({ error: "Fehler beim Abrufen der Nachrichten" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
