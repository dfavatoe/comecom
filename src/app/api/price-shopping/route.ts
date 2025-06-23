import { NextRequest, NextResponse } from "next/server";

interface ShoppingResult {
  title: string;
  link: string;
  price?: string;
  extracted_price?: number;
  store: string;
  source?: string;
  product_link: string;
}

const SERPAPI_KEY = process.env.SERPAPI_KEY!;
const OPENAI_SECRET = process.env.OPENAI_SECRET!;

/** Map UI country values - SerpAPI location+gl codes */
const countryMap: Record<
  string,
  { location: string; gl: string; hl?: string }
> = {
  Germany: { location: "Germany", gl: "de", hl: "de" },
  UnitedStates: { location: "United States", gl: "us", hl: "en" },
  Brazil: { location: "Brazil", gl: "br", hl: "pt" },
  UnitedKingdom: { location: "United Kingdom", gl: "uk", hl: "en" },
  France: { location: "France", gl: "fr", hl: "fr" },
};

// Data Retrieval function - builds a Google Shopping API query, using product as query and country as search definition
async function searchWithSerpAPI(
  query: string,
  country: string
): Promise<ShoppingResult[]> {
  const { location, gl, hl } = countryMap[country] || countryMap["Germany"];

  const params = new URLSearchParams({
    engine: "google_shopping",
    q: query,
    location,
    gl,
    api_key: SERPAPI_KEY,
  });

  if (hl) params.append("hl", hl); //host language, optional

  const res = await fetch(`https://serpapi.com/search.json?${params}`);
  if (!res.ok) {
    throw new Error(`SerpAPI error: HTTP ${res.status}`);
  }
  const data = await res.json();

  const results: ShoppingResult[] =
    data.shopping_results?.slice(0, 20).map((item: ShoppingResult) => ({
      title: item.title,
      price: item.extracted_price ? `$${item.extracted_price}` : item.price, //first number, second string
      store: item.source || "Unknown",
      link: item.product_link,
    })) || [];

  return results;
}

// AI-Powered Filtering: analyze and generate based on real-time retrieved data
async function analyzeWithOpenAI(
  query: string,
  ShoppingResults: ShoppingResult[]
) {
  // Augmentation:	Embed results into a structured GPT prompt
  const messages = [
    {
      role: "system",
      content: `You are a strict price comparison assistant. Based on search results, list up to 5 major sellers, their product prices, and URLs. Your job is to extract accurate product listings that very closely match the original product query — including brand, product type, packaging size, quantity, color and flavor.
        
        Only include products that:
        - Match the brand (e.g., Barilla, Apple)
        - Match the product type (e.g., Basilico pastasauce, MagSafe)
        - Match the packaging size (e.g., 200g)
        - Prioritize results showing the price for one unit of the product, unless it is strictly specified by the user (e.g. 10 units pack)
        - Are NOT variants, substitutes, different flavors or colors (e.g., no pesto sauce when tomato sauce is specified by the user)
        - Show the final product price, not price per kg or per 100g
        - When dealing with accessories, choose results that are from the original brand, unless it is defined by the user. (e.g iPhone 16 Pro Clear Case with MagSafe, from Apple and not from OtterBox or arktis)
        - Do not show results/prices with installment payments.
        `,
    },
    {
      role: "user",
      content: `
      Query: "${query}"
      Results:
      ${ShoppingResults.map(
        (r) =>
          `Title: ${r.title}\nPrice: ${r.price}\nStore: ${r.store}\nLink: ${r.link}`
      ).join("\n\n")}
        
      Format the output as:
      [
        {"title": "Product Title, ""store": "Store Name", "price": "$199.99", "url": "https://..."}
      ]  `.trim(),
    },
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_SECRET}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.2, // good for structured, analytical output (less random)
    }),
  });

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  try {
    return JSON.parse(content);
  } catch (err) {
    return { error: "Failed to parse OpenAI response", raw: content };
  }
}

// API Handler: gets query and country from the request body and runs them in the respective functions
export async function POST(req: NextRequest) {
  try {
    const { query, country } = await req.json();
    if (!query || !country)
      return NextResponse.json(
        { error: "Missing query or country" },
        { status: 400 }
      );

    const serpResults = await searchWithSerpAPI(query, country);
    const analysis = await analyzeWithOpenAI(query, serpResults);

    return NextResponse.json({ result: analysis });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
