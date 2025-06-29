import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import dbConnect from "@/app/lib/dbConnect";
import Post from "@/model/postModel";

function extractParams(req: NextRequest): string | null {
  const parts = req.nextUrl.pathname.split("/");
  return parts[3] || null;
}

export async function POST(req: NextRequest) {
  const postId = extractParams(req);

  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const userId = session.user.id;
    const hasLiked = post.likes.some((id: string) => id.toString() === userId);

    if (hasLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    return NextResponse.json({ message: "Toggled like", likes: post.likes });
  } catch (error) {
    console.error("LIKE ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
