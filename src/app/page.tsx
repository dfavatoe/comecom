// import { baseUrl } from "./lib/urls";
// import { useEffect, useRef, useState } from "react";
// import { ProductT } from "@/model/types/types";
// import styles from "./page.module.css";
// import NavBar from "@/components/NavBar";
// import Image from "next/image";
// import ProductCarousel from "@/components/ProductCarousel";

// // Function for mixing the images
// function shuffleArray<T>(array: ProductT[]): ProductT[] {
//   return array
//     .map((value) => ({ value, sort: Math.random() }))
//     .sort((a, b) => a.sort - b.sort)
//     .map(({ value }) => value);
// }

// export default function Home() {
//   const [products, setProducts] = useState<ProductT[] | null>(null);
//   const [visibleProducts, setVisibleProducts] = useState<ProductT[]>([]);
//   const productsRecords = products!.records as ProductT[];

//   // Ref für die Navbar
//   const navbarRef = useRef<HTMLDivElement>(null);

//   // Dynamische Höhe der Navbar ermitteln
//   const [navbarHeight, setNavbarHeight] = useState<number>(0);

//   useEffect(() => {
//     // Berechne die Höhe der Navbar nach dem Rendern
//     if (navbarRef.current) {
//       setNavbarHeight(navbarRef.current.clientHeight);
//     }
//   }, []);

//   useEffect(() => {
//     async function fetchProducts() {
//       const res = await fetch("https://dummyjson.com/products?limit=0");
//       const response = await res.json();
//       console.log("API response:", response); // optional zum Prüfen
//       const data: ProductT[] = response.products;

//       // Shuffle
//       const shuffled = shuffleArray(data);

//       // Schätzung: Wie viele Produkte passen rein?
//       // Beispiel: ca. 4 x 3 = 12 Bilder bei 200x200 + gap + padding
//       const maxVisible = 12;

//       setProducts(data);
//       setVisibleProducts(shuffled.slice(0, maxVisible));
//     }
//     fetchProducts();
//   }, []);

//   if (!products) return <div>Loading...</div>;

//   // IMAGES from OUR DATABASE
//   //  useEffect(() => {
//   //   async function fetchProducts() {
//   //     const res = await fetch(`${baseUrl}/api/products`);
//   //     const data = await res.json();
//   //     setProducts(data);
//   //   }
//   //   fetchProducts();
//   // }, []);

//   // if (!products) return <div>Loading...</div>;

//   return (
//     <>
//       <div
//         className={styles.container}
//         style={{
//           height: `calc(100vh - ${navbarHeight}px)`, // Höhe der Navbar dynamisch abziehen
//         }}
//       >
//         <div className={styles.overlay}>
//           <h1 className={styles.brand}>com&com</h1>
//         </div>

//         <div className={styles.grid}>
//           {products.map((product) => (
//             <div key={product.id} className={styles.gridItem}>
//               {/* <img
//                 src={product.images[0] || "/fallback.jpg"}
//                 alt={product.title}
//               /> */}
//               <Image
//                 src={product.images[0] || "/fallback.jpg"}
//                 alt={product.title}
//                 quality={50}
//                 //placeholder="blur"
//                 width={500}
//                 height={500}
//               />
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="second-header m-4" style={{ textAlign: "center" }}>
//         Featured Products
//       </div>
//       <ProductCarousel productsRecords={productsRecords} />
//       {/* {products &&
//         products.map((product) => {
//           return (
//             <div key={product._id}>
//               <div className={styles.container}>
//                 <div className={styles.overlay}>
//                   <h1 className={styles.brand}>com&com</h1>
//                 </div>
//                 <div className={styles.grid}>
//                   {products.map((product) => (
//                     <div key={product._id} className={styles.gridItem}>
//                       <img
//                         src={product.images[0] || "/fallback.jpg"}
//                         alt={product.title}
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           );
//         })} */}
//     </>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Carousel, Container, Spinner } from "react-bootstrap";
// import "../style/Home.css";
// import { fetchData } from "../hooks/useFetch";
//import "../style/Products.css";
import ProductCarousel from "../components/ProductCarousel";
import { ProductT } from "@/model/types/types";
import { baseUrl } from "./lib/urls";
import { useSession } from "next-auth/react";
import styles from "./page.module.css";
import Image from "next/image";

export interface ProductsRoot {
  message: string;
  amount: number;
  records: ProductT[];
}

// // Function for mixing the images
function shuffleArray<T>(array: ProductT[]): ProductT[] {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function filterAnimalProducts(products: ProductT[]): ProductT[] {
  const blacklist = [
    "meat",
    "beef",
    "chicken",
    "pork",
    "bacon",
    "egg",
    "eggs",
    "ham",
    "turkey",
    "lamb",
    "steak",
    "salami",
    "sausage",
    "fish",
    "tuna",
    "shrimp",
    "seafood",
    "dog food",
    "dairy",
  ];

  return products.filter((product) => {
    const text = `${product.title} ${product.description}`.toLowerCase();
    return !blacklist.some((keyword) => text.includes(keyword));
  });
}

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  const [products, setProducts] = useState<ProductT[]>([]);
  const [mosaicProducts, setMosaicProducts] = useState<ProductT[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<ProductT[]>([]);

  //   // Ref für die Navbar
  const navbarRef = useRef<HTMLDivElement>(null);

  //   // Dynamische Höhe der Navbar ermitteln
  const [navbarHeight, setNavbarHeight] = useState<number>(0);

  useEffect(() => {
    // Berechne die Höhe der Navbar nach dem Rendern
    if (navbarRef.current) {
      setNavbarHeight(navbarRef.current.clientHeight);
    }
  }, []);

  // useEffect(() => {
  //   fetchData("products", setProducts);
  // }, []);
  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch(`${baseUrl}/api/products`);
      const data = await res.json();
      console.log("API Response:", data);
      setProducts(data); // Direkt das Array setzen
    }
    fetchProducts();
  }, []);

  // useEffect(() => {
  //   async function fetchMosaicProducts() {
  //     const res = await fetch("https://dummyjson.com/products?limit=0");
  //     const response = await res.json();
  //     console.log("API response:", response);
  //     const data: ProductT[] = response.products;

  //     const shuffled = shuffleArray(data);

  //     const maxVisible = 40;

  //     setMosaicProducts(data);
  //     setVisibleProducts(shuffled.slice(0, maxVisible));
  //   }
  //   fetchMosaicProducts();
  // }, []);
  useEffect(() => {
    async function fetchMosaicProducts() {
      const res = await fetch("https://dummyjson.com/products?limit=0");
      const response = await res.json();
      const data: ProductT[] = response.products;

      // 🔸 NEU: Filterfunktion aufrufen
      const filtered = filterAnimalProducts(data);

      // 🔸 Shuffle die gefilterten Produkte
      const shuffled = shuffleArray(filtered);

      // const maxVisible = 40;
      // Dynamische Anzahl an sichtbaren Produkten basierend auf der Bildschirmbreite
      // const maxVisible =
      //   Math.ceil(window.innerWidth / 120) *
      //   Math.ceil(window.innerHeight / 120); // Basierend auf Grid-Breite und -Höhe

      // Dynamische Anzahl der sichtbaren Produkte basierend auf der Bildschirmbreite
      const columns = Math.floor(window.innerWidth / 120); // Anzahl der Spalten (Breite der Produkte)
      const rows = Math.floor(window.innerHeight / 120); // Anzahl der Reihen (Höhe der Produkte)

      // Berechne die maximale Anzahl an sichtbaren Produkten, nur vollständige Reihen
      const maxVisible = columns * rows;

      setMosaicProducts(filtered);
      setVisibleProducts(shuffled.slice(0, maxVisible));

      // Berechne die Höhe des Containers basierend auf der Anzahl der Reihen und der Größe der Grid-Items
      // const containerHeight = rows * 120;
      // document.getElementById(
      //   "mosaic-container"
      // )!.style.height = `${containerHeight}px`;
      // Berechne die Höhe des Containers basierend auf der Anzahl der Reihen und der Größe der Grid-Items
      const containerHeight = rows * 120; // Höhe des Containers in px (Anzahl der Reihen * Höhe eines Grid-Items)

      // Achte darauf, dass der Container hoch genug ist, um alle Elemente anzuzeigen
      document.getElementById(
        "mosaic-container"
      )!.style.height = `${containerHeight}px`;

      // Optional: Sicherstellen, dass der Container nicht kleiner als 100vh ist
      if (containerHeight < window.innerHeight) {
        document.getElementById("mosaic-container")!.style.minHeight = "100vh";
      }
    }

    fetchMosaicProducts();
  }, []);

  if (!products) return <div>Loading...</div>;

  // useEffect(() => {
  //   try {
  //     if (token) {
  //       console.log("%c user is logged in", "color:green");
  //     } else {
  //       console.log("%c user is logged out", "color:red");
  //     }
  //   } catch (error) {
  //     console.log("error :>> ", error);
  //   }
  // }, [token]);

  // if (!productsRecords.length) {
  //   return (
  //     <div>
  //       <Spinner animation="border" variant="warning" />
  //       <p>Loading...</p>
  //     </div>
  //   );
  // }
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
      <div
        className={styles.container}
        style={{
          // height: `calc(100vh - ${navbarHeight}px)`,
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
          {products.map((product) => (
            <div key={product._id} className={styles.gridItem}>
              {/* <img
                src={product.images[0] || "/fallback.jpg"}
                alt={product.title}
              /> *
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
        </div> */}
        <div className={styles.grid}>
          {visibleProducts.map((product, index) => (
            <div key={product.id || index} className={styles.gridItem}>
              <div className={styles.imageWrapper}>
                <Image
                  src={product.images[0] || "/fallback.jpg"}
                  alt={product.title}
                  fill
                  sizes="(max-width: 600px) 100vw, 25vw"
                  className={styles.image}
                  unoptimized
                />
                {/* <div className={styles.beigeOverlay}></div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* FEATERUEd */}
      <Container
        id="home-container"
        className="m-0 p-0"
        style={{ maxWidth: "100%" }}
      ></Container>

      {/* <div className="text-block">
        {session?.user ? (
          <p>Hello,{session.user.name} </p>
        ) : (
          <>
            <h6>Sign in for the full experience.</h6>
            <Link href="/login">Login</Link>
            <br />
          </>
        )}
      </div> */}

      <div
        // className="second-header m-4"
        style={{ textAlign: "center" }}
      >
        <h2>Featured Products</h2>
      </div>

      <ProductCarousel productsRecords={products} />
    </>
  );
}
