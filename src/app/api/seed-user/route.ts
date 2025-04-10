// app/api/seed-user/route.ts
import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/model/usersModel";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await dbConnect();

    const hashedPassword = await bcrypt.hash("password123", 10);

    const newUser = new UserModel({
      name: "test1",
      email: "test1@test.com",
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
