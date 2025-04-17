"use client";

import { baseUrl } from "./lib/urls";
import { useEffect, useRef, useState } from "react";
import { ProductT } from "@/model/types/types";
import styles from "./page.module.css";
import NavBar from "@/components/NavBar";
import Image from "next/image";

// Function for mixing the images
function shuffleArray<T>(array: ProductT[]): ProductT[] {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export default function Home() {
  const [products, setProducts] = useState<ProductT[] | null>(null);
  const [visibleProducts, setVisibleProducts] = useState<ProductT[]>([]);

  // Ref für die Navbar
  const navbarRef = useRef<HTMLDivElement>(null);

  // Dynamische Höhe der Navbar ermitteln
  const [navbarHeight, setNavbarHeight] = useState<number>(0);

  useEffect(() => {
    // Berechne die Höhe der Navbar nach dem Rendern
    if (navbarRef.current) {
      setNavbarHeight(navbarRef.current.clientHeight);
    }
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("https://dummyjson.com/products?limit=0");
      const response = await res.json();
      console.log("API response:", response); // optional zum Prüfen
      const data: ProductT[] = response.products;

      // Shuffle
      const shuffled = shuffleArray(data);

      // Schätzung: Wie viele Produkte passen rein?
      // Beispiel: ca. 4 x 3 = 12 Bilder bei 200x200 + gap + padding
      const maxVisible = 12;

      setProducts(data);
      setVisibleProducts(shuffled.slice(0, maxVisible));
    }
    fetchProducts();
  }, []);

  if (!products) return <div>Loading...</div>;

  // IMAGES from OUR DATABASE
  //  useEffect(() => {
  //   async function fetchProducts() {
  //     const res = await fetch(`${baseUrl}/api/products`);
  //     const data = await res.json();
  //     setProducts(data);
  //   }
  //   fetchProducts();
  // }, []);

  // if (!products) return <div>Loading...</div>;

  return (
    <>
      <div
        className={styles.container}
        style={{
          height: `calc(100vh - ${navbarHeight}px)`, // Höhe der Navbar dynamisch abziehen
        }}
      >
        <div className={styles.overlay}>
          <h1 className={styles.brand}>com&com</h1>
        </div>

        <div className={styles.grid}>
          {products.map((product) => (
            <div key={product.id} className={styles.gridItem}>
              {/* <img
                src={product.images[0] || "/fallback.jpg"}
                alt={product.title}
              /> */}
              <Image
                src={product.images[0] || "/fallback.jpg"}
                alt={product.title}
                quality={50}
                //placeholder="blur"
                width={500}
                height={500}
              />
            </div>
          ))}
        </div>
      </div>

      {/* {products &&
        products.map((product) => {
          return (
            <div key={product._id}>
              <div className={styles.container}>
                <div className={styles.overlay}>
                  <h1 className={styles.brand}>com&com</h1>
                </div>
                <div className={styles.grid}>
                  {products.map((product) => (
                    <div key={product._id} className={styles.gridItem}>
                      <img
                        src={product.images[0] || "/fallback.jpg"}
                        alt={product.title}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })} */}
    </>
  );
}
