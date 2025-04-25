"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Carousel, Container, Spinner } from "react-bootstrap";
import ProductCarousel from "../components/ProductCarousel";
import { ProductT } from "@/model/types/types";
import { baseUrl } from "./lib/urls";
import { useSession } from "next-auth/react";
import styles from "./page.module.css";
import UserAvatar from "@/components/UserAvatar";
import "@/app/globals.css";

export interface ProductsRoot {
  message: string;
  amount: number;
  records: ProductT[];
}

// // Function for mixing the images
// function shuffleArray<T>(array: ProductT[]): ProductT[] {
//   return array
//     .map((value) => ({ value, sort: Math.random() }))
//     .sort((a, b) => a.sort - b.sort)
//     .map(({ value }) => value);
// }

// function filterAnimalProducts(products: ProductT[]): ProductT[] {
//   const blacklist = [
//     "meat",
//     "beef",
//     "chicken",
//     "pork",
//     "bacon",
//     "egg",
//     "eggs",
//     "ham",
//     "turkey",
//     "lamb",
//     "steak",
//     "salami",
//     "sausage",
//     "fish",
//     "tuna",
//     "shrimp",
//     "seafood",
//     "dog food",
//     "dairy",
//   ];

//   return products.filter((product) => {
//     const text = `${product.title} ${product.description}`.toLowerCase();
//     return !blacklist.some((keyword) => text.includes(keyword));
//   });
// }

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  const [products, setProducts] = useState<ProductT[]>([]);
  // const [mosaicProducts, setMosaicProducts] = useState<ProductT[]>([]);
  // const [visibleProducts, setVisibleProducts] = useState<ProductT[]>([]);

  //   // Ref für die Navbar
  // const navbarRef = useRef<HTMLDivElement>(null);

  //   // Dynamische Höhe der Navbar ermitteln
  // const [navbarHeight, setNavbarHeight] = useState<number>(0);

  // useEffect(() => {
  //   // Berechne die Höhe der Navbar nach dem Rendern
  //   if (navbarRef.current) {
  //     setNavbarHeight(navbarRef.current.clientHeight);
  //   }
  // }, []);

  // useEffect(() => {
  //   async function fetchMosaicProducts() {
  //     const res = await fetch("https://dummyjson.com/products?limit=0");
  //     const response = await res.json();
  //     const data: ProductT[] = response.products;

  //     // 🔸 NEU: Filterfunktion aufrufen
  //     const filtered = filterAnimalProducts(data);

  //     // 🔸 Shuffle die gefilterten Produkte
  //     const shuffled = shuffleArray(filtered);

  //     // Dynamische Anzahl der sichtbaren Produkte basierend auf der Bildschirmbreite
  //     const columns = Math.floor(window.innerWidth / 120); // Anzahl der Spalten (Breite der Produkte)
  //     const rows = Math.floor(window.innerHeight / 120); // Anzahl der Reihen (Höhe der Produkte)

  //     // Berechne die maximale Anzahl an sichtbaren Produkten, nur vollständige Reihen
  //     const maxVisible = columns * rows;

  //     setMosaicProducts(filtered);
  //     setVisibleProducts(shuffled.slice(0, maxVisible));

  //     // Berechne die Höhe des Containers basierend auf der Anzahl der Reihen und der Größe der Grid-Items
  //     const containerHeight = rows * 120; // Höhe des Containers in px (Anzahl der Reihen * Höhe eines Grid-Items)

  //     // Achte darauf, dass der Container hoch genug ist, um alle Elemente anzuzeigen
  //     document.getElementById(
  //       "mosaic-container"
  //     )!.style.height = `${containerHeight}px`;

  //     // Optional: Sicherstellen, dass der Container nicht kleiner als 100vh ist
  //     if (containerHeight < window.innerHeight) {
  //       document.getElementById("mosaic-container")!.style.minHeight = "100vh";
  //     }
  //   }

  //   fetchMosaicProducts();
  // }, []);

  // if (!products) return <div>Loading...</div>;

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
      <div>
        <Spinner animation="border" variant="warning" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <h1 style={{ color: "var(--primary)" }}>Welcome</h1>

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
            Everything you need, all in one place.
          </p>
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

        {/* <div className={styles.grid}>
          {visibleProducts.map((product, index) => (
            <div key={product.id || index} className={styles.gridItem}>
              <div className={styles.imageWrapper}>
                <Image
                  src={product.thumbnail || "/fallback.jpg"}
                  alt={product.title}
                  fill
                  sizes="(max-width: 600px) 100vw, 25vw"
                  className={styles.image}
                  unoptimized
                />
              </div>
            </div>
          ))}
        </div> */}
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
