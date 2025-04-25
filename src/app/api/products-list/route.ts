//* This is the client's shopping-list
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import dbConnect from "@/app/lib/dbConnect";
import ProductModel from "@/model/productsModel";
import UserModel from "@/model/usersModel";

export async function GET(req: NextRequest) {
  console.log("get products from shopping list running");

  await dbConnect();
  mongoose.model("Product"); // Next.js needs this forced registration of the model before the UserModel is called for populating nested product's info!
  console.log("Ensuring ProductModel is loaded:", ProductModel.modelName);

  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.log("Models registered:", mongoose.modelNames()); // print model names

    const user = await UserModel.findById(session.user.id).populate({
      path: "productsList",
      populate: {
        path: "seller",
        select: ["name", "address"],
      },
      select: [
        "title",
        "price",
        "rating",
        "images",
        "reservation",
        "reservationTime",
        "seller",
      ],
    });

    if (!user) {
      console.log("User not found");
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.productsList.length === 0) {
      return NextResponse.json({
        message: "The list is empty.",
        amount: 0,
      });
    }

    return NextResponse.json({
      message: "All products in the list.",
      amount: user.productsList.length,
      records: user.productsList,
    });
  } catch (error) {
    console.error("Error fetching products list: ", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
