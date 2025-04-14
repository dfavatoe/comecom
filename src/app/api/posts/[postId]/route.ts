import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import dbConnect from "@/app/lib/dbConnect";
import Post from "@/model/postModel";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { postId: string } }
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

    if (post.user.toString() !== session.user.id) {
      return NextResponse.json({ error: "Not allowed to delete this post" }, { status: 403 });
    }

    await post.deleteOne();

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("DELETE POST ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
