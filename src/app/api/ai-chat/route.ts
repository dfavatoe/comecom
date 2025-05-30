import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import dbConnect from "@/app/lib/dbConnect";
import Product from "@/model/productsModel";
import UserModel from "@/model/usersModel";
import { ProductsList, ProductT } from "@/model/types/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_SECRET!,
});

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_SECRET) {
    return NextResponse.json(
      { error: "Missing OpenAI API Key" },
      { status: 500 }
    );
  }

  const { question, user, history } = await req.json();

  try {
    await dbConnect();

    const currentUser = await UserModel.findById(user?.id).populate(
      "productsList"
    );
    if (!currentUser) {
      return NextResponse.json({ answer: "You have to log in first." });
    }

    const allProducts = await Product.find().populate("seller");
    const sellers = await UserModel.find({ role: "seller" });

    const formatProduct = (p: ProductT) => ({
      title: p.title,
      description: p.description,
      category: p.category,
      discountPercentage: p.discountPercentage,
      rating: p.rating,
      stock: p.stock,
      price: p.price,
      brand: p.brand,
      sku: p.sku,
      weight: p.weight,
      reservation: p.reservation,
      reservationTime: p.reservationTime,
      minReservationQty: p.minReservationQty,
      returnPolicy: p.returnPolicy,
      warranty: p.warranty,
      depth: p.depth,
      height: p.height,
      width: p.width,
      tags: p.tags,
      seller: p.seller?.name || "Unknown Seller",
    });

    const productData = allProducts.map(formatProduct);

    const sellersData = sellers.map((s) => ({
      name: s.name,
      address: `${s.address?.streetName} ${s.address?.streetNumber}, ${s.address?.city} ${s.address?.postalcode}, ${s.address?.country}`,
      mapsLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${s.address?.streetName} ${s.address?.streetNumber} ${s.address?.city} ${s.address?.country} ${s.address?.postalcode}`
      )}`,
    }));

    const lowerCaseQuestion = question.toLowerCase();

    if (
      [
        "my products",
        "my list",
        "my shopping list",
        "my items",
        "what i have",
      ].some((kw) => lowerCaseQuestion.includes(kw))
    ) {
      if (!currentUser.productsList || currentUser.productsList.length === 0) {
        return NextResponse.json({
          answer: "You have no products in your list.",
        });
      }

      const userProductsFormatted = (currentUser.productsList as ProductsList[])
        .map((p) => {
          return `${p.title}: ${p.price} €`;
        })
        .join("\n");

      return NextResponse.json({
        answer: `Here are the products in your list:\n${userProductsFormatted}`,
      });
    }

    const systemPrompt = `
You are a smart AI assistant for an online marketplace.

Rules:
- Understand user questions even if they have typos or slight mistakes.
- Use ONLY the provided data. NEVER invent or assume anything not in the data.
- If multiple products have the same cheapest price, list ALL of them.
- If user specifies a market/seller, ONLY show products from that exact market/seller.
- NEVER mix products from different markets unless user clearly asks for all.
- If user mentions "they", "them" or "their", assume the user refers to the LAST mentioned market/seller unless specified otherwise.
- If user asks for "one product" (singular), provide only one (unless multiple products are tied by price).
- If user asks for "products" (plural), provide multiple products.
- If user asks for "my products" or "my list", reply has already been handled server-side.
- If user asks for the cheapest product in a specific market/seller, search ONLY that market/seller.
- Strictly match product seller name with market name.
- When user asks for address, reply ONLY with the plain address text (no links, no extra info).
- When user asks for a Google Maps link, reply ONLY with the pure link starting with "https://", no text, no brackets, no emojis.
- Reply in a clean, professional, and precise tone.

DATA:
Products:
${JSON.stringify(productData, null, 2)}

Markets:
${JSON.stringify(sellersData, null, 2)}
`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(history || []),
      { role: "user", content: question },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    const answer = completion.choices[0]?.message.content;
    if (!answer) {
      return NextResponse.json({ answer: "Sorry, I couldn't understand." });
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("AI Chat Error:", error);

    let message = "Something went wrong.";
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
