import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import dbConnect from "@/app/lib/dbConnect";
import ProductModel from "@/model/productsModel";
import { ReviewT } from "@/model/types/types";

function extractParams(req: NextRequest): string | null {
  const parts = req.nextUrl.pathname.split("/");
  return parts[3] || null;
}

//GET reviews
export async function GET(req: NextRequest) {
  const productId = extractParams(req);
  await dbConnect();

  try {
    const product = await ProductModel.findById(productId);

    if (!product) {
      return NextResponse.json(
        { message: `Product ${productId} not found.` },
        { status: 404 }
      );
    }

    const sortedReviews = product.reviews.sort(
      (a: ReviewT, b: ReviewT) =>
        new Date(b.date.getTime() - new Date(a.date).getTime())
    );

    if (sortedReviews.length === 0) {
      return NextResponse.json(
        { message: `No Reviews yet for ptoduct ${productId}.` },
        { status: 200 }
      );
    }

    return NextResponse.json({
      message: "Successfully fetched reviews.",
      reviews: sortedReviews,
    });
  } catch (error) {
    console.error("Error fetching reviews: ", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Post a review
export async function POST(req: NextRequest) {
  const productId = extractParams(req);
  await dbConnect();

  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { rating, comment } = await req.json();

    if (!rating || !comment) {
      return NextResponse.json(
        { error: "Rating and comment are required." },
        { status: 400 }
      );
    }

    const newReview = {
      author: session?.user!.name,
      email: session?.user!.email,
      rating,
      comment,
      date: new Date(),
    };

    const product = await ProductModel.findByIdAndUpdate(
      productId,
      { $push: { reviews: newReview } },
      { new: true }
    );

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Review added successfully",
      product,
    });
  } catch (error) {
    console.error("Error adding review", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
