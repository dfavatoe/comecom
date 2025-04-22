import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./productcarousel.module.css";
import { ProductT } from "@/model/types/types";

interface ProductCarouselProps {
  productsRecords: ProductT[];
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  productsRecords,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const productCardRef = useRef<HTMLDivElement>(null); //Card reference

  // Dynamic scrolling, based on card size
  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    const card = productCardRef.current;

    if (!container || !card) return;

    const cardWidth = card.offsetWidth + 10; // + gap zwischen Cards (z. B. 10px)
    const maxScroll = container.scrollWidth - container.clientWidth;

    if (direction === "left") {
      if (container.scrollLeft <= 0) {
        container.scrollTo({ left: maxScroll, behavior: "smooth" });
      } else {
        container.scrollBy({ left: -cardWidth, behavior: "smooth" });
      }
    } else {
      if (container.scrollLeft + 1 >= maxScroll) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    }
    // if (scrollContainerRef.current) {
    //   const scrollAmount = 300; // Adjust scroll amount as needed
    //   scrollContainerRef.current.scrollBy({
    //     left: direction === "left" ? -scrollAmount : scrollAmount,
    //     behavior: "smooth",
    //   });
    // }
  };

  // SIngle product card
  const ProductCard = ({
    product,
    index,
  }: {
    product: ProductT;
    index: number;
  }) => (
    // <div className={styles.productCard}>
    //   <img src={product.images[0]} alt={product.title} />
    //   <h4>{product.title}</h4>
    //   <span className="product-price">{product.price} € </span>
    // </div>

    <div
      ref={index === 0 ? productCardRef : null} // 🟡 Referenz nur auf die erste Card
      className={styles.productCard}
    >
      <img src={product.images[0]} alt={product.title} />
      <h4>{product.title}</h4>
      <span className="product-price">{product.price} €</span>
    </div>
  );

  return (
    <div
      className={styles.scrollmenu}
      // className="scrollmenu relative mb-4"
    >
      {/* Left Button */}
      <button
        onClick={() => scroll("left")}
        className={`${styles["carousel-button"]} ${styles.left}`}
        // className="carousel-button left"
        aria-label="Scroll left"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className={styles["scroll-container"]}
        //   className="scroll-container"
      >
        {productsRecords.map((product, index) => (
          <ProductCard key={product._id} product={product} index={index} />
        ))}
      </div>

      {/* Right Button */}
      <button
        onClick={() => scroll("right")}
        className={`${styles["carousel-button"]} ${styles.right}`}
        // className="carousel-button right"
        aria-label="Scroll right"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default ProductCarousel;
