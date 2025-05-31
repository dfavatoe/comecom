import dbConnect from "@/app/lib/dbConnect";
import { auth } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import MessageModel from "@/model/chatMessageModel";

// Edits a message
export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  //const chatroomId = url.pathname.split("/")[3]; // Extrahiere chatroomId aus der URL
  const messageId = url.pathname.split("/")[5]; // Extract messageId on the 5th position of the URL

  await dbConnect();

  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { messageText } = await req.json(); // get the new messageText from the request
    const updatedMessage = await MessageModel.findByIdAndUpdate(
      messageId,
      { messageText }, // Update the messageText
      { new: true } // returns the updated messageText
    );
    if (!updatedMessage) {
      return new NextResponse("Message not found.", { status: 404 });
    }
    return new NextResponse(JSON.stringify(updatedMessage), { status: 200 });
  } catch (error) {
    console.error("Message update error:", error);
    return new NextResponse("Error while updating the message.", {
      status: 500,
    });
  }
}

// Delete a message
export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  //const chatroomId = url.pathname.split("/")[3]; // Extrahiere chatroomId aus der URL
  const messageId = url.pathname.split("/")[5]; // Extracts the messageId from the URL
  await dbConnect();

  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const deletedMessage = await MessageModel.findByIdAndDelete(messageId); // Deletes a message through its ID
    if (!deletedMessage) {
      return new NextResponse("Message not found.", { status: 404 });
    }
    return new NextResponse("Message deleted.", { status: 200 });
  } catch (error) {
    console.error("Delete message error:", error);
    return new NextResponse("Error when deleting the message.", {
      status: 500,
    });
  }
}
