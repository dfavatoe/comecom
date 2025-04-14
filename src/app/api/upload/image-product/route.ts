import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Add these to your .env.local file
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false, // Disable body parsing to handle FormData
  },
};

export async function POST(req: NextRequest) {
  try {
    // Ensure the request is a POST request with a body
    if (!req.body) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Read the file from the request body
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Invalid content type" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert the Blob to a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload the file to Cloudinary
    const uploadToCloudinary = async (buffer: Buffer): Promise<string> => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          { folder: "products" }, // Optional: Specify a folder in Cloudinary
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result?.secure_url || "");
            }
          }
        );

        // Write the buffer to the Cloudinary upload stream
        uploadStream.end(buffer);
      });
    };

    const imageUrl = await uploadToCloudinary(buffer);

    return NextResponse.json({ url: imageUrl }, { status: 200 });
  } catch (error) {
    console.error("Error handling upload:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
