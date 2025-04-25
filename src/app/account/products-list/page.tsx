"use client";
import SellerProductsList from "@/components/SellerProductsList";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import BuyerShoppingList from "@/components/BuyerShoppingList";
import { Button, Container } from "react-bootstrap";
import Link from "next/link";

function ProductsList() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "loading") {
      setLoading(false); // Set loading to false once session status is resolved
    }
  }, [status]);

  if (loading) return <p>Loading...</p>;
  if (status === "unauthenticated")
    return (
      <Container className="d-block">
        <h4>You must be signed in to view your shopping list.</h4>
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
        <SellerProductsList />
      </>
    );
  }

  return <BuyerShoppingList />;
}

export default ProductsList;
