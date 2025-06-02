import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import UserModel from "@/model/usersModel";
import dbConnect from "@/app/lib/dbConnect";

export async function DELETE() {
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const user = await UserModel.findById(session.user?.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.address = undefined;
    await user.save();

    return NextResponse.json({
      message: "Address deleted successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        productsList: user.productsList,
        address: user.address,
      },
    });
  } catch (error) {
    console.error("Error deleting the address: ", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
