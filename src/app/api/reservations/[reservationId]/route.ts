// /app/api/reservations/[reservationId]/route.ts

import { NextResponse } from "next/server";
import { ReservationModel } from "@/model/reservationModel";
import dbConnect from "@/app/lib/dbConnect";

interface Params {
  params: {
    reservationId: string;
  };
}

export async function GET(req: Request, { params }: Params) {
  try {
    await dbConnect();
    const { reservationId } = params;

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
