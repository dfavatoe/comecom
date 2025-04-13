import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import UserModel from "@/model/usersModel";
import dbConnect from "@/app/lib/dbConnect";

export async function PUT(req: NextRequest) {
  await dbConnect();
  console.log("update complete user address");

  const body = await req.json();
  const { streetName, streetNumber, city, state, country, postalcode } = body;

  const api_key = process.env.GEO_API_KEY;

  if (!streetName || !streetNumber || !city || !postalcode) {
    return NextResponse.json(
      {
        error: "street name, street number, city and postal code are required",
      },
      { status: 400 }
    );
  }

  try {
    // Fetch geolocation
    const response = await fetch(
      `https://geocode.maps.co/search?street=${streetNumber}+${streetName}&city=${city}&state=${state}&postalcode=${postalcode}&country=${country}&api_key=${api_key}`
    );
    const result = await response.json();

    if (!result.length) {
      return NextResponse.json(
        { error: "Geolocation API returned no results" },
        { status: 400 }
      );
    }

    const lat = result[0].lat;
    const lon = result[0].lon;

    // Get current user
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      session.user.id,
      {
        address: {
          streetName,
          streetNumber,
          city,
          state,
          country,
          postalcode,
          latitude: lat,
          longitude: lon,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Complete address updated successfully",
      user: {
        _id: updatedUser._id,
        userName: updatedUser.userName,
        email: updatedUser.email,
        role: updatedUser.role,
        image: updatedUser.image,
        productsList: updatedUser.productsList,
        address: updatedUser.address,
      },
    });
  } catch (error: any) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      {
        error: "Something went wrong while updating the address.",
        errorStack: error.message,
      },
      { status: 500 }
    );
  }
}
