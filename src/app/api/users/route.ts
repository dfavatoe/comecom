import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/model/usersModel";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Connect to the database
    await dbConnect();
    console.log("Connected to DB");

    // Retrieve all users from the database
    const users = await UserModel.find();
    console.log("Users fetched:", users);

    // Return users as JSON response
    return Response.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return Response.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

//test registering new user: real signup at api/auth/signup
export async function POST() {
  try {
    await dbConnect();

    const hashedPassword = await bcrypt.hash("password123", 10);

    const newUser = new UserModel({
      name: "test2",
      email: "test2@test.com",
      password: hashedPassword,
      address: {
        streetName: "Paper street",
        streetNumber: "1",
        city: "Berlin",
        postalcode: "0400",
      },
    });

    await newUser.save();
    return NextResponse.json({ message: "User created!" }, { status: 201 });
  } catch (error) {
    console.error("Error seeding user:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
