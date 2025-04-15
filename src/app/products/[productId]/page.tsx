"use client";

import { useEffect, useRef, useState } from "react";
import { baseUrl } from "@/app/lib/urls";
import { ProductT } from "@/model/types/types";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import ModalAlert from "@/components/ModalAlert";
import { useParams } from "next/navigation";
import Link from "next/link";
import AddToShoppingListButton from "@/components/addToShoppingListButton";

export default function SingleProductPage() {
  const { productId } = useParams<{ productId: string }>();
  console.log("productId :>> ", productId);

  //State Hooks
  const [product, setProduct] = useState<ProductT | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState("");

  // UseRef Hook used to scroll the Page to the Reviews
  const topReviewsRef = useRef<HTMLHeadingElement | null>(null);
  const scrollCallback = () => {
    if (topReviewsRef.current) {
      topReviewsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

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

  const inStock = (product: ProductT | null) => {
    if (product) {
      return product.stock ? (
        <h4 style={{ color: "#138808" }}>In stock</h4>
      ) : (
        <h4 style={{ color: "#dc143c" }}>Not available</h4>
      );
    }
  };

  const discount = (product: ProductT | null) => {
    if (product) {
      return product.discountPercentage > 0
        ? `Discount: ${product.discountPercentage} %`
        : null;
    }
  };

  const reservationMark = (productReservation: ProductT | null) => {
    const checked = "✅ ";
    const unchecked = "❌";
    return productReservation?.reservation ? (
      <span>
        {checked}
        {productReservation.reservationTime} minutes
      </span>
    ) : (
      unchecked
    );
  };

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`${baseUrl}/api/products/${productId}`);
        const data = await res.json();
        setProduct(data);
        console.log("data :>> ", data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    }
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  return (
    <div>
      <h1 className="m-4" style={{ textAlign: "center" }}>
        com&com Products
      </h1>

      <Container style={{ width: "auto", height: "auto", textAlign: "left" }}>
        <Row>
          {product && (
            <>
              <Col sm="6">
                <h3>{product.title}</h3>
                <p>
                  {product.rating}{" "}
                  <span className="paint-stars">
                    {countStars(product.rating)}
                  </span>
                  <Button onClick={() => scrollCallback()} variant="link">
                    See the reviews
                  </Button>
                </p>

                <h4>{product.price} €</h4>
                <h6>{discount(product)} </h6>
                <Image src={product.images[0]} rounded fluid />
              </Col>

              <Col className="mb-4" sm="6">
                {inStock(product)}
                <h5>Description:</h5>
                <ul>
                  <li>
                    Seller:{" "}
                    <Link
                      className="mb-2"
                      href={`/store/${product.seller._id}`}
                    >
                      {product.seller.name}
                    </Link>{" "}
                  </li>
                  <li>
                    See more from
                    <a href="#"> {product.brand}</a>{" "}
                  </li>
                  <li>{product?.description}</li>
                </ul>
                <hr />
                <h5>Product Details:</h5>
                <ul>
                  <li>
                    <b>Reservation:</b> {reservationMark(product)}
                  </li>
                  <li>
                    <b>Warranty:</b> {product.warranty}
                  </li>
                  <li>
                    <b>Return policy:</b> {product.returnPolicy}
                  </li>
                  <li>
                    <b>Minimum Order: </b>
                    {product.minReservationQty} items
                  </li>
                </ul>
                <hr />
                <h5>Dimensions:</h5>
                <ul>
                  <li>
                    <b>Width:</b> {product.width} mm
                  </li>
                  <li>
                    <b>Height:</b> {product.height} mm
                  </li>
                  <li>
                    <b>Depth:</b> {product.depth} mm
                  </li>
                </ul>

                <AddToShoppingListButton productId={productId} />
              </Col>
            </>
          )}
          <hr />
        </Row>
        <h4 ref={topReviewsRef}>Top Reviews:</h4>

        {/* <Reviews productId={productId!} /> */}
        <ModalAlert
          showAlert={showAlert}
          alertText={alertText}
          setShowAlert={setShowAlert}
        />
      </Container>
    </div>
  );
}
