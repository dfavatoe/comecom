import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/model/usersModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    // Parse the request body
    const body = await req.json();
    const { userId, productsList } = body;

    if (!userId || !productsList) {
      return NextResponse.json(
        { error: "Missing userId or productsList in the request body" },
        { status: 400 }
      );
    }

    // Find the user by ID
    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the product is already in the user's list
    const existingProductInList = user.productsList.includes(productsList);
    if (existingProductInList) {
      return NextResponse.json(
        { message: "User already has this product in the shopping list." },
        { status: 400 }
      );
    }

    // Add the product to the user's list
    user.productsList.push(productsList);
    await user.save();

    return NextResponse.json(
      {
        message: "Product successfully added to the shopping list",
        user: {
          _id: user._id,
          name: user.userName,
          email: user.email,
          role: user.role,
          image: user.image,
          productsList: user.productsList,
          address: user.address,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error adding product to list", error);
    return NextResponse.json(
      { error: error.message || "Server Error" },
      { status: 500 }
    );
  }
}
