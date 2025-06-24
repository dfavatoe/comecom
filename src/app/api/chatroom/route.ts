import dbConnect from "@/app/lib/dbConnect";
import { auth } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import ChatroomModel from "@/model/chatroomModel";
import { createChatroom } from "@/app/lib/chatroom";

// GET all the chatrooms
export async function GET() {
  try {
    await dbConnect();

    const chatrooms = await ChatroomModel.find()
      .populate("participants", "name email _id") // <- Only the fields that you need
      .lean();

    return new NextResponse(JSON.stringify(chatrooms), { status: 200 });
  } catch (error) {
    console.error("Error getting the chatrooms: ", error);
    return new NextResponse(
      JSON.stringify({ error: "Error getting the chatrooms" }),
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

  const body = await req.json();
  const { chatroomId, participants } = body;

  if (!chatroomId || !participants || participants.length < 2) {
    return new NextResponse(
      JSON.stringify({
        message: "Chatroom ID and 2 participants are required",
      }),
      { status: 400 }
    );
  }

  try {
    const newChatroom = await createChatroom(chatroomId, participants);
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
