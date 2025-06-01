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

  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { messageText } = await req.json();

  // Benutzer in der Datenbank suchen, um die ID zu erhalten
  try {
    const user = await UserModel.findById(session.user.id); // Find the user from the session's ID
    if (!user) {
      return new NextResponse(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Creates a new message
    const newMessage = new MessageModel({
      chatroomId,
      messageText,
      authorId: user._id, // Sets the author from the message retrieved from the database
      authorName: user.name,
    });

    // Saves the message
    await newMessage.save();

    return new NextResponse(JSON.stringify(newMessage), { status: 201 });
  } catch (error) {
    console.error("Error creating the message: ", error);
    return new NextResponse("Error creating the message.", {
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
    const query: Record<string, unknown> = { chatroomId }; //corrected "any" type to "Record".

    if (after) {
      const afterDate = new Date(Number(after)); // "after" an number (Timestamp)
      query.createdAt = { $gt: afterDate };
    }

    const messages = await MessageModel.find(query).sort({ createdAt: 1 });
    console.log(messages);

    return new NextResponse(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    console.error("Error getting the message:", error);
    return new NextResponse(
      JSON.stringify({ error: "Error getting the message." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
