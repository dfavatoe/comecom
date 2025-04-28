import { Card, Stack } from "react-bootstrap";

import style from "./productcard.module.css";
import { ProductT } from "@/model/types/types";
import Link from "next/link";
import AddToShoppingListButton from "./addToShoppingListButton";

type ProductCardProps = {
  product: ProductT;
};

function ProductCard({ product }: ProductCardProps) {
  return (
    <>
      <Card
        className={style.card}
        style={{
          width: "18rem",
          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
          textAlign: "center",
        }}
      >
        <Card.Img
          className={style.image}
          variant="top"
          src={product.images[0]}
        />
        <Card.Body className="d-flex flex-column">
          <Card.Title>{product.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {product.price} €
          </Card.Subtitle>
          <Stack gap={3}>
            <Link className="mb-2" href={`/products/${product._id}`}>
              Learn more
            </Link>
          </Stack>

          <AddToShoppingListButton productId={product._id} />
        </Card.Body>
      </Card>
    </>
  );
}

export default ProductCard;
