"use client";

import { baseUrl } from "@/app/lib/urls";
import Link from "next/link";
import { useState } from "react";
import { Button, Container, Spinner } from "react-bootstrap";
import { useToast } from "@/hooks/useToast";

function AvatarGenerator() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const generateAvatar = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/generate-avatar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setImageUrl(data.avatarUrl);
    } catch (error: any) {
      showToast(error.message || "Something went wrong!", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      className="d-flex flex-column align-items-center text-center"
      style={{ minHeight: "100vh" }}
    >
      <h2>Generate Your AI Avatar</h2>
      <h5 className="mb-4">
        com&com is powered with AI tools to create fantastic avatar images
      </h5>
      <div style={{ maxWidth: "50vw" }}>
        <p>
          It is very simple, just write below a short description of your avatar
          and press the "Generate Avatar" button. You will have a preview of the
          result and after that it will automatically substitute your profile's
          picture.
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: "500px" }}>
        <input
          type="text"
          value={prompt}
          placeholder="Describe your avatar's vibe"
          className="form-control mb-3"
          onChange={(e) => setPrompt(e.target.value)}
        />
        <Button
          onClick={generateAvatar}
          disabled={loading}
          className="mx-auto d-block mb-3"
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" /> Generating...
            </>
          ) : (
            "Generate Avatar"
          )}
        </Button>
        {/* Toast */}
        {imageUrl && (
          <div className="mt-4">
            <h5>Here's your new avatar:</h5>
            <img
              src={imageUrl}
              alt="Generated Avatar"
              className="img-fluid rounded mb-3"
              style={{ maxWidth: "200px" }}
            />
          </div>
        )}
      </div>

      <Link href={"/account"}>Check your Profile</Link>
    </Container>
  );
}

export default AvatarGenerator;
