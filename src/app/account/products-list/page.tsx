"use client";
import SellerAddProduct from "@/components/SellerAddProduct";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

function AddProduct() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "loading") {
      setLoading(false); // Set loading to false once session status is resolved
    }
  }, [status]);

  if (loading) return <p>Loading...</p>;
  if (status === "unauthenticated")
    return <h4>You must be signed in to view your account.</h4>;

  if (session?.user!.role === "seller") {
    return (
      <>
        <SellerAddProduct />
        setLoading(false)
      </>
    );
  }

  return <p>Shopping List Under Construction!</p>;
}

export default AddProduct;
