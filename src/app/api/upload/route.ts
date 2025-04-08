import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import dbConnect from "@/app/lib/dbConnect";
import cloudinary from "@/app/lib/cloudinary";
import Post from "@/model/postModel";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const caption = formData.get("caption") as string;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    const result: any = await new Promise((resolve, reject) => {
      (cloudinary.uploader.upload_stream as any)(
        { folder: "posts" },
        (error: any, result: any) => {
          if (error) return reject(error);
          resolve(result);
        }
      ).end(buffer);
    });

    const newPost = new Post({
      imageUrl: result.secure_url,
      caption,
      user: session.user.id,
    });

    await newPost.save();

    return NextResponse.json(
      { message: "Post uploaded successfully!" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
