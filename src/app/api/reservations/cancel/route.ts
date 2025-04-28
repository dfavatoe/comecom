import dbConnect from "@/app/lib/dbConnect";
import ProductModel from "@/model/productsModel";
import { ReservationModel } from "@/model/reservationModel";
import { NextRequest, NextResponse } from "next/server";

// API to handle reservation cancellation
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const { reservationId } = await req.json();

    if (!reservationId) {
      return NextResponse.json(
        { error: "Reservation ID is required" },
        { status: 400 }
      );
    }

    const reservation = await ReservationModel.findById(reservationId);

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    // Update the reservation status
    reservation.status = "cancelled";
    await reservation.save();

    // Find the associated product and increment stock
    const product = await ProductModel.findById(reservation.productId);
    if (product) {
      product.stock += 1;
      await product.save();
    }

    return NextResponse.json(
      { message: "Reservation cancelled successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to cancel reservation" },
      { status: 500 }
    );
  }
}
