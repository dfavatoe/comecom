"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Container, Spinner } from "react-bootstrap";
import ProductCarousel from "../components/ProductCarousel";
import { ProductT } from "@/model/types/types";
import { baseUrl } from "./lib/urls";
import styles from "./page.module.css";
import "@/app/globals.css";

export interface ProductsRoot {
  message: string;
  amount: number;
  records: ProductT[];
}

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductT[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch(`${baseUrl}/api/products`);
      const data = await res.json();
      console.log("API Response:", data);
      setProducts(data); // Direkt das Array setzen
    }
    fetchProducts();
  }, []);

  if (!products || products.length === 0) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center">
        <Spinner animation="border" variant="warning" />
        <p className="mt-2">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div
        className={styles.container}
        style={{
          height: `min(70vh, 600px)`, // nie höher als 600px, max 70% vom Viewport
          marginBottom: "60px",
        }}
      >
        {/* Beige Overlay über den gesamten Container */}
        <div className={styles.beigeOverlay}></div>

        <div className={styles.overlay}>
          <h1 className={styles.brand}>com&com</h1>
          <p className={styles.subtitel}>
            The social and e-commerce retailers platform
          </p>
          <p>Buy, sell, post, chat and enjoy AI features</p>
          <Button
            className="mt-2 mb-2"
            variant="warning"
            onClick={() => {
              router.push("/products");
            }}
          >
            Products
          </Button>
        </div>
      </div>

      <Container
        id="home-container"
        className="m-0 p-0"
        style={{ maxWidth: "100%" }}
      ></Container>

      <div style={{ textAlign: "center" }}>
        <h2>Featured Products</h2>
      </div>

      <ProductCarousel productsRecords={products} />
    </>
  );
}
