"use client";
import SellerProductsList from "@/components/SellerProductsList";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import BuyerShoppingList from "@/components/BuyerShoppingList";
import { Container, Spinner } from "react-bootstrap";
import Link from "next/link";
import "@/app/globals.css";
import PriceAnalysis from "@/components/PriceAnalysis";

function PriceAnalysisPage() {
  const { data: session, status } = useSession();
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

  if (session?.user!.role === "seller") {
    return (
      <>
        <PriceAnalysis />
      </>
    );
  }

  return <PriceAnalysis />;
}

export default PriceAnalysisPage;
