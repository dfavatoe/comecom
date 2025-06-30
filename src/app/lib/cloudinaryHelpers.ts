// import {
//   CloudinaryUploadError,
//   CloudinaryUploadResult,
// } from "@/model/types/types";
import cloudinary from "./cloudinary";
import {
  UploadApiResponse,
  UploadApiErrorResponse,
  UploadApiOptions,
} from "cloudinary";
import stream from "stream";

export function uploadToCloudinary(buffer: Buffer): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "ai-generated" } as UploadApiOptions,
      (
        error: UploadApiErrorResponse | undefined,
        result: UploadApiResponse | undefined
      ) => {
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
