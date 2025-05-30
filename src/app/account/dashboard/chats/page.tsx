"use client";
import SellerChatDashboard from "@/components/SellerChatDashboard";
import { useSession } from "next-auth/react";
import "@/app/globals.css";
import { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import Link from "next/link";

export default function SellerChatPage() {
  const { status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "loading") {
      setLoading(false); // Set loading to false once session status is resolved
    }
  }, [status]);

  if (loading)
    return (
      <div className="d-flex flex-column align-items-center justify-content-center">
        <Spinner animation="border" variant="warning" />
        <p className="mt-2">Loading...</p>
      </div>
    );

  if (status === "unauthenticated")
    return (
      <Container className="d-block">
        <h4>You must be signed in to view your account.</h4>
        <div className="d-block mb-4">
          <Link className="d-inline" href={"/signup"}>
            Sign up{" "}
          </Link>
          <span>or </span>
          <Link className="d-inline" href={"/login"}>
            Log in{" "}
          </Link>
        </div>
      </Container>
    );

  return <SellerChatDashboard />;
}
