import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import dbConnect from "@/app/lib/dbConnect";
import Post from "@/model/postModel";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { postId: string; commentId: string } }
) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const post = await Post.findById(params.postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const comment = post.comments.find(
      (c: any) => c._id.toString() === params.commentId
    );

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (comment.user?.toString() !== session.user.id) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    post.comments = post.comments.filter(
      (c: any) => c._id.toString() !== params.commentId
    );

    await post.save();

    return NextResponse.json({ message: "Comment deleted" });
  } catch (error: any) {
    console.error(" DELETE COMMENT ERROR:", error);
    return NextResponse.json(
      {
        error: "Server error",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
