import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import ProductModel from "@/model/productsModel";

export async function DELETE(req: NextRequest) {
  try {
    const { ids } = await req.json(); // expects: { ids: string[] }

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "No product IDs provided." },
        { status: 400 }
      );
    }

    await dbConnect();

    await ProductModel.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({ message: "Products deleted successfully." });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
