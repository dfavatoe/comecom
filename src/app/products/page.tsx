"use client";
import React from "react";
import { useState, useEffect } from "react";
import { baseUrl } from "../lib/urls";
import { ProductT } from "@/model/types/types";
import { Alert, Container } from "react-bootstrap";
import Grid from "@/components/Grid";
import Link from "next/link";

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
      <Container>
        <h1 className="m-4" style={{ textAlign: "center" }}>
          com&com Products
        </h1>
        <Alert variant="warning">
          {" "}
          Welcome to Com&Com — your one-stop shop for everything you need! From
          the latest tech gadgets and home essentials to fashion, beauty, and
          more, we bring you a wide variety of sellers and products all in one
          place. Fell free to contact our sellers and post your buying
          experiences in our{" "}
          <span>
            <Link href={"/post"}>Social</Link>
          </span>{" "}
          page.
        </Alert>

        <Container className="justify-content-center">
          <>
            <Grid products={products}></Grid>
          </>
        </Container>
      </Container>
    </>
  );
}
