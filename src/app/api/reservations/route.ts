import ProductModel from "@/model/productsModel";
import { ReservationModel } from "@/model/reservationModel";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import dbConnect from "@/app/lib/dbConnect";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Auto-cancel expired reservations
    await ReservationModel.updateMany(
      { expiresAt: { $lte: new Date() }, status: "active" },
      { $set: { status: "cancelled" } }
    );

    const { productId } = await req.json();
    const buyerId = session.user?.id;

    //Fetch product: check if exists and is in stock
    const product = await ProductModel.findById(productId);
    if (!product || product.stock <= 0) {
      return NextResponse.json(
        { error: "Product unavailable" },
        { status: 400 }
      );
    }

    //Extract the sellerId from the product
    const sellerId = product.seller;

    //Check duplicate reservation
    const existingReservation = await ReservationModel.findOne({
      buyerId,
      productId,
      status: "active",
    });

    if (existingReservation) {
      return NextResponse.json({ error: "Already reserved" }, { status: 400 }); //bad request: invalid request
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + product.reservationTime * 60000); //reservationTime in minutes

    const reservation = await ReservationModel.create({
      buyerId,
      sellerId: sellerId,
      productId,
      startTime: now,
      expiresAt,
      status: "active",
    });

    product.stock -= 1;
    await product.save();

    return NextResponse.json({ reservation });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    //Find active reservation by productId
    const reservation = await ReservationModel.findOne({
      productId,
      status: "active",
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "No active reservation found for this product" },
        { status: 404 }
      );
    }

    //cancel the reservation
    reservation.status = "cancelled";
    await reservation.save();

    //Find the product and increment stock by 1
    const product = await ProductModel.findById(productId);
    if (product) {
      product.stock += 1;
      await product.save();
    }

    return NextResponse.json(
      { message: "Reservation cancelled Successfully" },
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

export async function GET(req: Request) {
  try {
    // Step 1: Auto-cancel expired reservations
    await ReservationModel.updateMany(
      { expiresAt: { $lte: new Date() }, status: "active" },
      { $set: { status: "cancelled" } }
    );

    // Extract buyerId from the query string
    const url = new URL(req.url);
    const buyerId = url.searchParams.get("buyerId");

    // Step 2: Fetch reservations
    const reservations = await ReservationModel.find({ buyerId });

    return NextResponse.json({ reservations });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json(
      { error: "Failed to fetch reservations" },
      { status: 500 }
    );
  }
}
