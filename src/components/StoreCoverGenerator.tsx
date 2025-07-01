"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, Container, Spinner } from "react-bootstrap";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/useToast";

export default function StoreCoverGenerator() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const { data: session } = useSession();
  const { showToast } = useToast();

  const generateCoverImage = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/generate-cover`, {
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
      showToast("Failed to generate image", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center text-center">
      <h2>Generate AI images to your Store</h2>
      <h5 className="mb-4">
        com&com is powered with AI tools to personalize how your store looks
      </h5>
      <div style={{ maxWidth: "50vw" }}>
        <p>
          It is very simple, just write below a short image description, that
          you wish as a cover on the top of your store and press the
          &quot;Generate Cover&quot; button. You will have a preview of the
          result and after that it will automatically add it to the store.
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: "500px" }}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your store..."
          className="form-control mb-3"
        />
        <Button
          //variant="warning"
          onClick={generateCoverImage}
          disabled={loading}
          className="mx-auto d-block mb-3"
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" /> Generating...
            </>
          ) : (
            "Generate Cover"
          )}
        </Button>

        {imageUrl && (
          <div className="text-center">
            <h4>Generated Cover:</h4>
            <img
              src={imageUrl}
              alt="Store Cover"
              className="img-fluid mt-3 mb-4"
              style={{ maxWidth: "100%" }}
            />
          </div>
        )}
      </div>
      <Link href={`/store/${session?.user!.id}`}>Go to your Store</Link>
    </Container>
  );
}
