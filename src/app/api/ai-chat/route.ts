import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import dbConnect from "@/app/lib/dbConnect";
import Product from "@/model/productsModel";
import UserModel from "@/model/usersModel";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

function normalize(str: string) {
  return str.toLowerCase().trim();
}

export async function POST(req: NextRequest) {
  const { question, user } = await req.json();

  try {
    await dbConnect();

    const currentUser = await UserModel.findById(user?.id);
    if (!currentUser) {
      return NextResponse.json({ answer: "User not found." });
    }

    const isSeller = currentUser.role === "seller";

    const products = isSeller
      ? await Product.find({ seller: user.id }).populate("seller")
      : await Product.find().populate("seller").limit(20);

    const productData = products.map((p) => ({
      title: p.title,
      description: p.description,
      price: p.price,
      rating: p.rating,
      brand: p.brand,
      stock: p.stock,
      tags: p.tags,
      seller: p.seller?.name || "Unknown Seller",
    }));

    const q = normalize(question);

    const matchedProduct = productData.find((product) =>
      normalize(product.title).includes(q) ||
      normalize(product.description || "").includes(q) ||
      (Array.isArray(product.tags) && product.tags.some((tag) => normalize(tag).includes(q)))
    );

    if (matchedProduct) {
      const reply = `
 Product found:
- Title: ${matchedProduct.title}
- Description: ${matchedProduct.description}
- Price: $${matchedProduct.price}
- Brand: ${matchedProduct.brand}
- Stock: ${matchedProduct.stock}
- Rating: ${matchedProduct.rating}
- Seller: ${matchedProduct.seller}
      `;
      return NextResponse.json({ answer: reply });
    }

    const address = currentUser.address;

    const prompt = `
You are an AI assistant for an online marketplace.

Only use the following product and store data to answer. 
When the user says "this market" or "this store", they are referring to the current seller’s store. 
Answer strictly from the data above. Only answer exactly what the user is asking for. 

If the user asks for products (including phrases like "products", "other products", or "items"), respond with a clean bullet list like:
1. Product A
2. Product B
3. Product C

Do not return JSON. Do not add extra details unless explicitly requested.

Store Owner: ${currentUser.name}
Address: ${address.streetName} ${address.streetNumber}, ${address.city}, ${address.country} (${address.postalcode})

Products:
${JSON.stringify(productData, null, 2)}

User question:
"${question}"

Your answer:
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const answer = completion.choices[0]?.message.content;
    return NextResponse.json({ answer });
  } catch (error) {
    console.error("AI Chat Error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
