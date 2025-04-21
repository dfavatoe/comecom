"use client";

import { baseUrl } from "@/app/lib/urls";
import { useState } from "react";
import { Button } from "react-bootstrap";

export default function StoreCoverGenerator() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const generateCoverImage = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/generate-cover`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
      setImageUrl(data.imageUrl);
    } catch (err) {
      console.error("Error generating image:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your store..."
        className="input"
      />
      <Button
        //variant="warning"
        onClick={generateCoverImage}
        disabled={loading}
        className="mx-2"
      >
        {loading ? "Generating..." : "Generate Cover"}
      </Button>

      {imageUrl && (
        <div>
          <h4>Generated Cover:</h4>
          <img
            src={imageUrl}
            alt="Store Cover"
            className="mt-4 w-full max-w-md"
          />
        </div>
      )}
    </div>
  );
}
