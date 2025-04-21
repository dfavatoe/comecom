import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_SECRET });

export async function improvePrompt(prompt: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that rewrites short prompts for image generation.",
      },
      {
        role: "user",
        content: `Improve this prompt for a product store cover image: "${prompt}"`,
      },
    ],
    model: "gpt-3.5-turbo",
  });

  return completion.choices[0]?.message!.content!.trim();
}
