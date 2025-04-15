import { auth } from "@/app/lib/auth";
import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/model/usersModel";
import { NextResponse } from "next/server";

export async function GET() {
  //Check session user
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Connect to the database
    await dbConnect();
    console.log("Connected to DB");
    console.log("SESSION SERVER:", session);
    const user = await UserModel.findById(session.user.id);
    console.log("Found user:", user);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
