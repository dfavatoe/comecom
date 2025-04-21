import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import ProductModel from "@/model/productsModel";

export async function PUT(req: NextRequest) {
  try {
    const { id, updates } = await req.json();

    if (!id || !updates) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    await dbConnect();
    await ProductModel.findByIdAndUpdate(id, updates);

    return NextResponse.json({ message: "Product updated successfully" });
  } catch (err) {
    console.error("Update error :>> ", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
