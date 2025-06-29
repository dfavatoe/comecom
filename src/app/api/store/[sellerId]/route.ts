import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import ProductModel from "@/model/productsModel";
import UserModel from "@/model/usersModel";

function extractParams(req: NextRequest): string | null {
  const parts = req.nextUrl.pathname.split("/");
  return parts[3] || null;
}

export async function GET(req: NextRequest) {
  await dbConnect();

  const sellerId = extractParams(req);
  //console.log("getSellersProducts running");
  //console.log("sellerId :>> ", sellerId);

  try {
    const productsBySeller = await ProductModel.find({ seller: sellerId });
    const sellerInfo = await UserModel.findById(sellerId);

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
      sellerInfo: {
        _id: sellerInfo._id,
        name: sellerInfo.name,
        email: sellerInfo.email,
        image: sellerInfo.image,
        storeCoverImage: sellerInfo.storeCoverImage,
        address: sellerInfo.address,
        created_at: sellerInfo.created_at,
      },
      productsBySeller,
    });
  } catch (error) {
    console.error("Error fetching seller products:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
