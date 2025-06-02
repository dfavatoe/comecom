//* This is the seller's product's list
import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import ProductModel from "@/model/productsModel";
import { auth } from "@/app/lib/auth";

export async function GET() {
  await dbConnect();

  const session = await auth();

  const sellerId = session?.user!.id;
  console.log("getSellersProductsList running");
  console.log("sellerId :>> ", sellerId);

  try {
    const productsBySeller = await ProductModel.find({ seller: sellerId });

    if (!productsBySeller.length) {
      return NextResponse.json(
        {
          message: `No products by seller ${sellerId} found in the database.`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: `All products from seller ${sellerId} and additional seller info.`,
      amount: productsBySeller.length,
      products: productsBySeller,
    });
  } catch (error) {
    console.error("Error fetching seller products:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
