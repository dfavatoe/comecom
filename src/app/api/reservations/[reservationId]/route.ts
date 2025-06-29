// /app/api/reservations/[reservationId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { ReservationModel } from "@/model/reservationModel";
import dbConnect from "@/app/lib/dbConnect";

function extractParams(req: NextRequest): string | null {
  const parts = req.nextUrl.pathname.split("/");
  return parts[2] || null;
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const reservationId = extractParams(req);

    const reservation = await ReservationModel.findById(reservationId);

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(reservation);
  } catch (error) {
    console.error("Error fetching reservation:", error);
    return NextResponse.json(
      { error: "Failed to fetch reservation" },
      { status: 500 }
    );
  }
}
