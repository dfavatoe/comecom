import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { auth } from "@/app/lib/auth";
import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/model/usersModel";
import { bufferFromURL } from "@/app/lib/bufferFromURL";
import { uploadToCloudinary } from "@/app/lib/cloudinaryHelpers";
import { improvePromptAvatar } from "@/app/lib/openaiHelpers";

const openai = new OpenAI({ apiKey: process.env.OPENAI_SECRET });

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    // Improve prompt
    const improvedPrompt = await improvePromptAvatar(prompt);
    console.log("Improved Prompt (Avatar): ", improvedPrompt);

    // Generate image with OpenAI
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: improvedPrompt,
      size: "1024x1024",
      response_format: "url",
    });

    const openaiImageUrl = imageResponse.data[0]?.url;
    if (!openaiImageUrl) {
      throw new Error("OpenAI did not return an image URL.");
    }

    // Convert to buffer
    const imageBuffer = await bufferFromURL(openaiImageUrl);

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(imageBuffer);
    const cloudinaryUrl = uploadResult.secure_url;

    // Save to MongoDB in avatar field
    const updatedUser = await UserModel.findByIdAndUpdate(session.user.id, {
      avatar: cloudinaryUrl,
    });

    console.log("✅ Avatar updated:", updatedUser?.avatar);

    console.log("User from session:", session.user);

    return NextResponse.json({ avatarUrl: cloudinaryUrl });
  } catch (err) {
    console.error("Avatar generation error: ", err);
    return NextResponse.json(
      { error: "Avatar generation failed" },
      { status: 500 }
    );
  }
}
