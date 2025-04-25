import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { auth } from "@/app/lib/auth";
import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/model/usersModel";
import { bufferFromURL } from "@/app/lib/bufferFromURL";
import { uploadToCloudinary } from "@/app/lib/cloudinaryHelpers";
import { improvePrompt } from "@/app/lib/openaiHelpers";

const openai = new OpenAI({ apiKey: process.env.OPENAI_SECRET });

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    // 3. Improve prompt
    const improvedPrompt = await improvePrompt(prompt);
    console.log("Improved Prompt:", improvedPrompt);

    // 4. Generate image with OpenAI
    const imageResponse = await openai.images.generate({
      model: "dall-e-2",
      prompt: improvedPrompt,
      size: "512x512",
      response_format: "url",
    });

    const openaiImageUrl = imageResponse.data[0]?.url!;

    // 5–6. Convert to buffer
    const imageBuffer = await bufferFromURL(openaiImageUrl);

    // 7. Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(imageBuffer);
    const cloudinaryUrl = uploadResult.secure_url;

    // 8. Save to MongoDB
    await UserModel.findByIdAndUpdate(session.user.id, {
      storeCoverImage: cloudinaryUrl,
    });

    return NextResponse.json({ imageUrl: cloudinaryUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Image generation failed" },
      { status: 500 }
    );
  }
}
