"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, Container, Spinner } from "react-bootstrap";
import { useToast } from "@/hooks/useToast";
import Image from "next/image";

function AvatarGenerator() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const generateAvatar = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/generate-avatar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setImageUrl(data.avatarUrl);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Something went wrong generating the avatar!";
      showToast(errorMessage, "danger");
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
          and press the &quot;Generate Avatar&quot; button. You will have a
          preview of the result and after that it will automatically substitute
          your profile&apos;s picture.
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
            <h5>Here&apos;s your new avatar:</h5>
            <Image
              className="img-fluid rounded mb-3"
              src={imageUrl}
              width="200"
              style={{ maxWidth: "200px" }}
              alt="Generated Avatar's Image"
            />
          </div>
        )}
      </div>

      <Link href={"/account"}>Check your Profile</Link>
    </Container>
  );
}

export default AvatarGenerator;
