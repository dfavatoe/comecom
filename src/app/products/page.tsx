"use client";
import React from "react";
import { useState, useEffect } from "react";
import { baseUrl } from "../lib/urls";
import { ProductT } from "@/model/types/types";
import { Spinner } from "react-bootstrap";
import Grid from "@/components/Grid";
import Link from "next/link";
import "@/app/globals.css";

export default function Products() {
  const [products, setProducts] = useState<ProductT[] | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch(`/api/products`);
      const data = await res.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  if (!products)
    return (
      <div className="d-flex flex-column align-items-center justify-content-center">
        <Spinner animation="border" variant="warning" />
        <p className="mt-2">Loading...</p>
      </div>
    );

  return (
    <>
      <div>
        <h1 className="mt-4" style={{ textAlign: "center" }}>
          com&com Products
        </h1>
        <h4 className="mb-3" style={{ textAlign: "center" }}>
          com&com is your one-stop shop for everything you need!
        </h4>

        <div
          className="mb-4"
          style={{
            maxWidth: "70vw",
            textAlign: "center",
            margin: "0 auto",
            fontWeight: "500",
          }}
        >
          From the latest tech gadgets and home essentials to fashion, beauty,
          and more, we bring you a wide variety of sellers and products all in
          one place. Fell free to contact our sellers and post your buying
          experiences in our{" "}
          <span>
            <Link href={"/post"}>Social</Link>
          </span>{" "}
          page.
        </div>

        <div
          className="justify-content-center my-0"
          style={{
            background: "var(--secondary)",
            padding: "2rem",
          }}
        >
          <>
            <Grid products={products}></Grid>
          </>
        </div>
      </div>
    </>
  );
}
