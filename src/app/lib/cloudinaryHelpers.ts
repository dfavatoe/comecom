import {
  CloudinaryUploadError,
  CloudinaryUploadResult,
} from "@/model/types/types";
import cloudinary from "./cloudinary";
import stream from "stream";

export function uploadToCloudinary(
  buffer: Buffer
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "ai-generated" },
      (error: CloudinaryUploadError, result: CloudinaryUploadResult) => {
        if (error || !result) {
          return reject(error || new Error("Unknown Cloudinary error"));
        }
        resolve(result);
      }
    );

    const passthrough = new stream.PassThrough();
    passthrough.end(buffer);
    passthrough.pipe(uploadStream);
  });
}
