import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import dbConnect from "@/app/lib/dbConnect";

import Post from "@/model/postModel";

export async function POST(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text } = await req.json();
    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Comment text is required" }, { status: 400 });
    }

    await dbConnect();

    const post = await Post.findById(params.postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const newComment = {
      user: session.user.id,
      text,
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    return NextResponse.json({ message: "Comment added", post });
  } catch (error) {
    console.error("COMMENT ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}