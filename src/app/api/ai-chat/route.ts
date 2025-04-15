import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import dbConnect from "@/app/lib/dbConnect";
import Product from "@/model/productsModel";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  const { question } = await req.json();

  try {
    await dbConnect();

    const products = await Product.find().populate("seller"); 

    const productData = products.map((p) => ({
      title: p.title,
      description: p.description,
      price: p.price,
      rating: p.rating,
      category: p.category,
      brand: p.brand,
      stock: p.stock,
      seller: p.seller?.name || "Unknown",
      reviews: (Array.isArray(p.reviews) ? p.reviews : [])?.map((r: any) => ({
        rating: r.rating,
        comment: r.comment,
        author: r.author,
      })),
    }));

    const prompt = `
You are a helpful and professional AI assistant for an e-commerce website.
Answer the user's question using only the product data provided below.
If the exact product name isn't matched, try to infer based on keywords like brand, category, or description.

Here is the product data:
${JSON.stringify(productData, null, 2)}

User's question:
"${question}"

If the answer cannot be found within the product data, respond with:
"Sorry, I don't have enough product information to answer that."
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const answer = completion.choices[0]?.message.content;
    return NextResponse.json({ answer });
  } catch (error) {
    console.error("AI Chat Error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
