import dbConnect from "@/app/lib/dbConnect";
import { auth } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server"; // Hier verwenden wir NextRequest und NextResponse
import ChatroomModel from "@/model/chatroomModel";
import UserModel from "@/model/usersModel";
import { getSession } from "next-auth/react";
import { createChatroom } from "@/app/lib/chatroom";

// GET api/chatroom - Gibt alle Chatrooms zurück
export async function GET(req: NextRequest) {
  // const session = await auth(); // auth() gibt die Session zurück
  // if (!session?.user) {
  //   return new NextResponse("Unauthorized", { status: 401 }); // Falls keine Session oder User vorhanden ist
  // }

  try {
    await dbConnect();
    const chatrooms = await ChatroomModel.find();
    return new NextResponse(JSON.stringify(chatrooms), { status: 200 });
  } catch (error) {
    // return new NextResponse("Fehler beim Abrufen der Chatrooms", {
    //   status: 500,
    // });
    return new NextResponse(
      JSON.stringify({ error: "Fehler beim Abrufen der Chatrooms" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return new NextResponse(
      JSON.stringify({ message: "User not authenticated or missing ID" }),
      { status: 401 }
    );
  }

  const userId = session.user.id;

  const body = await req.json();
  const { chatroomId } = body;

  if (!chatroomId) {
    return new NextResponse(
      JSON.stringify({ message: "Chatroom ID is required" }),
      { status: 400 }
    );
  }

  try {
    const newChatroom = await createChatroom(userId, chatroomId);
    return new Response(JSON.stringify(newChatroom), { status: 200 });
  } catch (error) {
    console.error("❌ API Error:", error); // raus nehmen wenn nicht mehr gebraucht TODO
    return new Response(
      JSON.stringify({
        message: "Error creating chatroom",
        error: error instanceof Error ? error.message : error,
      }),
      { status: 500 }
    );
  }
}

// POST api/chatroom - Erstellt einen neuen Chatroom
// export async function POST(req: NextRequest) {
//   await dbConnect();
//   console.log("Connected to DB");

//   const session = await auth(); // auth() gibt die Session zurück
//   if (!session?.user) {
//     // return new NextResponse("Unauthorized", { status: 401 });
//     return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
//       status: 401,
//       headers: { "Content-Type": "application/json" },
//     });
//   }

//   try {
//     // const { otherUserId } = await req.json(); // Die ID des anderen Benutzers (Verkäufer oder Käufer)
//     // const buyerId = session.user.id;
//     // Erwarte, dass die Teilnehmer im Array übergeben werden (z. B. [buyerId, sellerId])
//     const { participants } = await req.json();
//     const [buyerId, otherUserId] = participants;

//     if (!buyerId || !otherUserId) {
//       return new NextResponse(
//         JSON.stringify({ error: "Invalid participants" }),
//         { status: 400, headers: { "Content-Type": "application/json" } }
//       );
//     }

//     // Hole den User, um zu prüfen, ob er Käufer oder Verkäufer ist
//     const buyer = await UserModel.findById(buyerId);
//     const otherUser = await UserModel.findById(otherUserId);

//     if (!buyer || !otherUser) {
//       return new NextResponse("User not found", { status: 404 });
//       // return new NextResponse(JSON.stringify({ error: "User not found" }), {
//       //   status: 404,
//       //   headers: { "Content-Type": "application/json" },
//       // });
//     }

//     // Prüfen, ob der Käufer und Verkäufer korrekt sind
//     if (buyer.role !== "buyer" || otherUser.role !== "seller") {
//       // return new NextResponse("Invalid user roles", { status: 400 });
//       return new NextResponse(JSON.stringify({ error: "Invalid user roles" }), {
//         status: 400,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     // Überprüfen, ob bereits ein Chatroom existiert
//     const existingChatroom = await ChatroomModel.findOne({
//       participants: { $all: [buyerId, otherUserId] },
//     });

//     if (existingChatroom) {
//       return new NextResponse(JSON.stringify(existingChatroom), {
//         status: 200,
//       });
//     }

//     // Erstelle einen neuen Chatroom
//     const newChatroom = new ChatroomModel({
//       participants: [buyerId, otherUserId],
//     });

//     await newChatroom.save();
//     return new NextResponse(JSON.stringify(newChatroom), { status: 201 });
//   } catch (error) {
//     // return new NextResponse("Fehler beim Erstellen des Chatrooms", {
//     //   status: 500,
//     // });
//     return new NextResponse(
//       JSON.stringify({ error: "Fehler beim Erstellen des Chatrooms" }),
//       {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       }
//     );
//   }
// }
