import ProductModel from "@/model/productsModel";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import dbConnect from "@/app/lib/dbConnect";

export async function PUT(req: NextRequest) {
  await dbConnect();

  const session = await auth();

  if (!session?.user?.id || session.user.role !== "seller") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const {
      title,
      brand,
      description,
      category,
      price,
      stock,
      images,
      warranty,
      returnPolicy,
      reservation,
      minReservationQty,
      reservationTime,
      discountPercentage,
      width,
      height,
      depth,
      rating,
    } = body;

    const seller = session.user.id;

    const existingProduct = await ProductModel.findOne({ title, seller });

    if (existingProduct) {
      return NextResponse.json(
        { message: "Seller already has this product in the database" },
        { status: 400 }
      );
    }

    const newProduct = new ProductModel({
      title,
      brand,
      description,
      category,
      price,
      stock,
      seller,
      images,
      warranty,
      returnPolicy,
      reservation,
      minReservationQty,
      reservationTime,
      discountPercentage,
      rating,
      width,
      height,
      depth,
    });

    const savedProduct = await newProduct.save();

    return NextResponse.json({
      message: "Product registered successfully",
      product: {
        _id: savedProduct._id,
        title: savedProduct.title,
        brand: savedProduct.brand,
        description: savedProduct.description,
        category: savedProduct.category,
        price: savedProduct.price,
        stock: savedProduct.stock,
        seller: savedProduct.seller,
        images: savedProduct.images,
        warranty: savedProduct.warranty,
        returnPolicy: savedProduct.returnPolicy,
        reservation: savedProduct.reservation,
        minReservationQty: savedProduct.minReservationQty,
        reservationTime: savedProduct.reservationTime,
        discountPercentage: savedProduct.discountPercentage,
        rating: savedProduct.rating,
        width: savedProduct.width,
        height: savedProduct.height,
        depth: savedProduct.depth,
      },
    });
  } catch (error: any) {
    console.error("Error adding the product:", error);
    return NextResponse.json(
      {
        error: "Something went wrong during product's register.",
        errorStack: error.message,
      },
      { status: 500 }
    );
  }
}
