import dbConnect from "@/app/lib/dbConnect";
import { auth } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import ChatroomModel from "@/model/chatroomModel";
import MessageModel from "@/model/chatMessageModel";
import UserModel from "@/model/usersModel";

// POST api/chatroom/[chatroomId]/message - Erstellt eine neue Nachricht im Chatroom
export async function POST(
  req: NextRequest,
  { params }: { params: { chatroomId: string } }
) {
  // const { chatroomId } = req.params; // Hole die chatroomId aus der URL
  //const url = new URL(req.url);
  //const chatroomId = url.pathname.split("/")[3]; // Der chatroomId befindet sich an Position 3 in der URL (z.B. /api/chatroom/:chatroomId)
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
    // if (!user) {
    //   return new NextResponse("User not found", { status: 404 });
    // }
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
  { params }: { params: { chatroomId: string } }
) {
  const { chatroomId } = params;
  await dbConnect();

  const url = new URL(req.url);
  const after = url.searchParams.get("after");

  try {
    let query: any = { chatroomId };

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

// GET api/chatroom/[chatroomId]/message - Gibt alle Nachrichten eines Chatrooms zurück
// export async function GET(
//   req: NextRequest,
//   { params }: { params: { chatroomId: string } }
// ) {
//   //const { chatroomId } = req.params; // Hole die chatroomId aus der URL
//   // const url = new URL(req.url);
//   // const chatroomId = url.pathname.split("/")[3]; // Der chatroomId befindet sich an Position 3 in der URL (z.B. /api/chatroom/:chatroomId)
//   const { chatroomId } = params;
//   await dbConnect();

//   //   const session = await auth(); // auth() gibt die Session zurück
//   //   if (!session?.user) {
//   //     return new NextResponse("Unauthorized", { status: 401 });
//   //   }

//   try {
//     const messages = await MessageModel.find({ chatroomId }); // Alle Nachrichten des Chatrooms abrufen
//     return new NextResponse(JSON.stringify(messages), { status: 200 });
//   } catch (error) {
//     console.error("Fehler beim Abrufen der Nachrichten:", error);
//     // return new NextResponse("Fehler beim Abrufen der Nachrichten", {
//     //   status: 500,
//     // });
//     return new NextResponse(
//       JSON.stringify({ error: "Fehler beim Abrufen der Nachrichten" }),
//       {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       }
//     );
//   }
// }
