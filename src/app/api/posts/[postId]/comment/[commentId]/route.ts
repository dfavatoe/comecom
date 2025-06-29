import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import dbConnect from "@/app/lib/dbConnect";
import Post from "@/model/postModel";
import { Comment } from "@/model/types/types";

function extractParams(req: NextRequest) {
  const parts = req.nextUrl.pathname.split("/");
  return {
    postId: parts[3],
    commentId: parts[5],
  };
}

export async function DELETE(req: NextRequest) {
  const { postId, commentId } = extractParams(req);

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

    const comment = post.comments.find(
      (c: Comment) => c._id.toString() === commentId
    );

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (comment.user?.toString() !== session.user.id) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    post.comments = post.comments.filter(
      (c: Comment) => c._id.toString() !== commentId
    );

    await post.save();

    return NextResponse.json({ message: "Comment deleted" });
  } catch (error) {
    console.error(" DELETE COMMENT ERROR:", error);
    return NextResponse.json(
      {
        error: "Server error",
      },
      { status: 500 }
    );
  }
}
