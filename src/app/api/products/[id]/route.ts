import dbConnect from "@/app/lib/dbConnect";
import ProductModel from "@/model/productsModel";
import "@/model/usersModel"; // Ensure the User model is registered
import { NextRequest, NextResponse } from "next/server";

function extractParams(req: NextRequest): string | null {
  const parts = req.nextUrl.pathname.split("/");
  return parts[3] || null;
}

export async function GET(req: NextRequest) {
  const id = extractParams(req);

  try {
    // Connect to the database
    await dbConnect();
    console.log("Connected to DB");

    // Retrieve a product by Id from the database
    const singleProduct = await ProductModel.findById(id).populate({
      path: "seller",
      select: ["name", "email", "_id", "image"],
    });
    if (!singleProduct) {
      return NextResponse.json(
        { message: `Product with id ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(singleProduct, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
