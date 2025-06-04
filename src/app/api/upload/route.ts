import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import dbConnect from "@/app/lib/dbConnect";
import cloudinary from "@/app/lib/cloudinary";
import Post from "@/model/postModel";
import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

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
    const result: UploadApiResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "posts" },
          (
            error: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined
          ) => {
            if (error || !result) return reject(error);
            resolve(result);
          }
        )
        .end(buffer);
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
    console.error("Post upload error: ", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
