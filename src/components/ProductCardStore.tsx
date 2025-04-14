"use client";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { ProductT } from "@/model/types/types";
import style from "./productcard.module.css";
import { MouseEvent, useState } from "react";
import { baseUrl } from "@/app/lib/urls";
import ModalAlert from "./ModalAlert";
import Link from "next/link";
import AddToShoppingListButton from "./addToShoppingListButton";

type ProductCardProps = {
  product: ProductT;
};

function ProductCardStore({ product }: ProductCardProps) {
  // const [showAlert, setShowAlert] = useState(false);
  // const [alertText, setAlertText] = useState("");

  const countStars = (productRating: number | null) => {
    if (productRating) {
      const fullStars = "★";
      const emptyStars = "☆";
      const starInt = Math.floor(productRating);
      const totalStars =
        fullStars.repeat(starInt) + emptyStars.repeat(5 - starInt);
      return totalStars;
    }
  };

  return (
    <Container className="mt-0">
      <Card
        className={style.card}
        style={{
          width: "auto",
          height: "auto",
          textAlign: "left",
          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
        }}
      >
        <Card.Body className="m-2">
          <Row>
            <Col
              md={2}
              sm={6}
              className="d-flex justify-content-center border-end"
            >
              <Card.Img
                className={style.image}
                variant="top"
                style={{ objectFit: "cover" }}
                src={product.images[0]}
              />
            </Col>
            <Col md={5} sm={6} className="border-end">
              <Card.Body className="d-flex flex-column">
                <Card.Title>{product.title}</Card.Title>
                <span className="paint-stars mb-2">
                  {countStars(product.rating)}
                </span>
                <Card.Subtitle className="mb-2">
                  {product.price} €
                </Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">
                  Discount: {product.discountPercentage} %
                </Card.Subtitle>
                <Link className="mb-2" href={`/products/${product._id}`}>
                  See details
                </Link>
              </Card.Body>
            </Col>
            <Col sm={6} className="d-flex-column justify-content-center" md={4}>
              <Card.Title className="mt-3">Description:</Card.Title>
              <div
                style={{
                  height: "100px",
                  overflowY: "scroll",
                  padding: "0.5em",
                  marginBottom: "1rem",
                }}
              >
                <Card.Subtitle
                  className="mb-2 text-muted"
                  style={{ textJustify: "auto" }}
                >
                  {product.description}
                </Card.Subtitle>
              </div>

              <AddToShoppingListButton productId={product._id} />

              <Container className="d-inline-flex justify-content-left"></Container>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      {/* <ModalAlert
        showAlert={showAlert}
        alertText={alertText}
        setShowAlert={setShowAlert}
      /> */}
    </Container>
  );
}

export default ProductCardStore;
