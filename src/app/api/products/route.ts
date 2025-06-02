import dbConnect from "@/app/lib/dbConnect";
import ProductModel from "@/model/productsModel";
import { NextResponse } from "next/server";

export async function GET() {
  console.log(`Fetching all records from ${ProductModel}`);

  try {
    //Connect to the database
    await dbConnect();
    console.log("Connected to DB");

    //Retrieve all products from the database
    const products = await ProductModel.find().populate({
      path: "seller",
      select: ["name", "email", "_id"],
    });
    console.log("Products fetched :>> ", products);

    //Return products as JSON response
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error,
      },
      { status: 500 }
    );
  }
}
