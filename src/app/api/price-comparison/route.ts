import { NextRequest, NextResponse } from "next/server";

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
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

async function searchWithSerpAPI(query: string, country: string) {
  const { location, gl, hl } = countryMap[country] || countryMap["Germany"];

  const params = new URLSearchParams({
    engine: "google",
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

  const results =
    data.organic_results?.slice(0, 10).map((item: SearchResult) => ({
      title: item.title,
      snippet: item.snippet,
      link: item.link,
    })) || [];

  return results;
}

async function analyzeWithOpenAI(query: string, searchResults: SearchResult[]) {
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
      ${searchResults
        .map((r) => `Title: ${r.title}\nSnippet: ${r.snippet}\nLink: ${r.link}`)
        .join("\n\n")}
        
      Format the output as:
      [
        {"store": "Store Name", "price": "$199.99", "url": "https://..."}
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
    console.error(err);
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
