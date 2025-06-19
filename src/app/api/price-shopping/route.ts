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
  // add more as needed
};

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
    data.shopping_results?.slice(0, 10).map((item: ShoppingResult) => ({
      title: item.title,
      price: item.extracted_price ? `$${item.extracted_price}` : item.price, //first number, second string
      store: item.source || "Unknown",
      link: item.product_link,
    })) || [];

  return results;
}

async function analyzeWithOpenAI(
  query: string,
  ShoppingResults: ShoppingResult[]
) {
  const messages = [
    {
      role: "system",
      content:
        "You are a price comparison assistant. Based on search results, list up to 5 major sellers, their product prices, and URLs.",
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
      temperature: 0.2, // good for structured, analytical output
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
