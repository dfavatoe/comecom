"use client";
import React from "react";
import { useState, useEffect } from "react";
import { baseUrl } from "../lib/urls";
import { ProductT } from "@/model/types/types";

export default function Products() {
  const [products, setProducts] = useState<ProductT[] | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch(`${baseUrl}/api/products`);
      const data = await res.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  if (!products) return <div>Loading...</div>;

  return (
    <>
      <h1 className="m-4" style={{ textAlign: "center" }}>
        com&com Products
      </h1>
      <ul>
        {products.map((product) => (
          <li key={product._id}>{product.title}</li>
        ))}
      </ul>
    </>
  );
}
