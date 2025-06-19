import { NextRequest, NextResponse } from "next/server";

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

const SERPAPI_KEY = process.env.SERPAPI_KEY!;
const OPENAI_SECRET = process.env.OPENAI_SECRET!;

async function searchWithSerpAPI(query: string) {
  const res = await fetch(
    `https://serpapi.com/search.json?q=${encodeURIComponent(
      query
    )}&api_key=${SERPAPI_KEY}`
  ); // ajust it to search in Germany?
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
    return { error: "Failed to parse OpenAI response", raw: content };
  }
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query)
      return NextResponse.json({ error: "Missing query" }, { status: 400 });

    const serpResults = await searchWithSerpAPI(query);
    const analysis = await analyzeWithOpenAI(query, serpResults);

    return NextResponse.json({ result: analysis });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
