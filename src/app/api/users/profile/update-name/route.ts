import { auth } from "@/app/lib/auth";
import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/model/usersModel";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  //Check session user
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    //Connect to the database
    await dbConnect();

    //Parse the request body
    const body = await req.json();
    const { userId, newUserName } = body;

    if (!userId || !newUserName) {
      return NextResponse.json(
        { error: "Missing userId or a newUserName in the request body" },
        { status: 400 }
      );
    }

    //Find the user by ID and Update the name
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { name: newUserName },
      {
        new: true,
      }
    );
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error updating name: ", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
