"use client";
import SellerAddProduct from "@/components/SellerAddProduct";
import React from "react";
import { useSession } from "next-auth/react";

function AddProduct() {
  const { data: session, status } = useSession();

  if (session?.user!.role === "seller") return <SellerAddProduct />;

  return <p>Shopping List Under Construction!</p>;
}

export default AddProduct;
