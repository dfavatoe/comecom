import dbConnect from "@/app/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { ReservationModel } from "@/model/reservationModel";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const sellerId = url.searchParams.get("sellerId");

    if (!sellerId) {
      return NextResponse.json(
        { error: "Seller ID is required" },
        { status: 400 }
      );
    }

    const reservations = await ReservationModel.find({ sellerId }).populate(
      "productId"
    );

    return NextResponse.json({ reservations }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch reservations" },
      { status: 500 }
    );
  }
}
