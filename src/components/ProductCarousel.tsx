import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./productcarousel.module.css";
import { ProductT } from "@/model/types/types";
import { Stack } from "react-bootstrap";
import Link from "next/link";
import AddToShoppingListButton from "./addToShoppingListButton";

interface ProductCarouselProps {
  productsRecords: ProductT[];
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  productsRecords,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const productCardRef = useRef<HTMLDivElement>(null);

  // Dynamic scrolling, based on card size
  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    const card = productCardRef.current;

    if (!container || !card) return;

    const cardWidth = card.offsetWidth + 10;
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
  };

  // Single product card
  const ProductCard = ({
    product,
    index,
  }: {
    product: ProductT;
    index: number;
  }) => (
    <div
      ref={index === 0 ? productCardRef : null}
      className={styles.productCard}
    >
      <img src={product.images[0]} alt={product.title} />
      <h4>{product.title}</h4>
      <span className="product-price">{product.price} €</span>
      <Stack gap={3}>
        <Link className="mb-2" href={`/products/${product._id}`}>
          Learn more
        </Link>
      </Stack>

      <AddToShoppingListButton productId={product._id} />
    </div>
  );

  return (
    <div className={styles.scrollmenu}>
      {/* Left Button */}
      <button
        onClick={() => scroll("left")}
        className={`${styles["carousel-button"]} ${styles.left}`}
        aria-label="Scroll left"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Scrollable Container */}
      <div ref={scrollContainerRef} className={styles["scroll-container"]}>
       {Array.isArray(productsRecords) && productsRecords.map((product, index) => (
  <ProductCard key={product._id} product={product} index={index} />
))}

      </div>

      {/* Right Button */}
      <button
        onClick={() => scroll("right")}
        className={`${styles["carousel-button"]} ${styles.right}`}
        aria-label="Scroll right"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default ProductCarousel;
