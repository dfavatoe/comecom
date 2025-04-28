import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Post from "@/model/postModel";

export async function GET() {
  try {
    await dbConnect();

    const posts = await Post.find({})
      .populate("user", "name email image avatar")
      .populate("comments.user", "name _id")
      .sort({ createdAt: -1 });

    return NextResponse.json(posts, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
