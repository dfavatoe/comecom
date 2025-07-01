"use client";
import { Button, Card, Col, Container, Row, Stack } from "react-bootstrap";
import { ProductsList } from "@/model/types/types";
import Link from "next/link";
import { useCountdown } from "@/hooks/useCountdown";
import { useToast } from "@/hooks/useToast";
import { useEffect } from "react";

type ProductCardProps = {
  product: ProductsList;
  reservationStatus: string;
};

function ProductCardList({ product, reservationStatus }: ProductCardProps) {
  const { showToast } = useToast();

  const shouldRunCountdown =
    product.reservation && reservationStatus !== "cancelled";

  const { formattedTime, start, reset, isActive } = useCountdown(
    shouldRunCountdown ? product.reservationTime : 0,
    `countdown_${product._id}` // Unique storage key for each product
  );

  const sellerAddress = product.seller?.address
    ? `${product.seller.address.streetName} ${product.seller.address.streetNumber}, ${product.seller.address.postalcode} ${product.seller.address.city}`
    : "";

  const handleReserve = async () => {
    try {
      const response = await fetch(`/api/reservations`, {
        method: "POST",
        body: JSON.stringify({
          productId: product._id,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const { error } = await response.json();
        showToast(error || "Failed to reserve product", "danger");
        return;
      }
      //if reservation was successfull, start countdown
      start();
    } catch (error) {
      console.error("Error reserving product:", error);
      showToast("Something went wrong while reserving", "danger");
    }
  };

  const handleCancelReservation = async () => {
    try {
      const response = await fetch(`/api/reservations`, {
        method: "DELETE",
        body: JSON.stringify({
          productId: product._id,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const { error } = await response.json();
        showToast(error || "Failed to cancel reservation", "danger");
        return;
      }

      //If successfully canceld on the backend, reset frontend countdown
      reset();
      // Clear countdown from sessionStorage manually
      sessionStorage.removeItem(`countdown_${product._id}`);
      showToast("Reservation cancelled successfully", "success");
    } catch (error) {
      console.error("Error canceling reservation:", error);
      showToast("Something went wrong while canceling", "danger");
    }
  };

  useEffect(() => {
    if (reservationStatus === "cancelled") {
      // Clear countdown from sessionStorage
      sessionStorage.removeItem(`countdown_${product._id}`);

      // Also reset the countdown manually
      reset();
    }
  }, [reservationStatus, product._id]);

  return (
    <Container className="mt-0">
      <Card
        className="p-0"
        style={{
          width: "auto",
          height: "auto",
          textAlign: "center",
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
                className="image"
                variant="top"
                style={{ objectFit: "cover" }}
                src={product.images[0]}
              />
            </Col>
            <Col md={5} sm={6} className="border-end">
              <Card.Body className="d-flex flex-column">
                <Card.Title>{product.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {product.price} €
                </Card.Subtitle>
                <Stack gap={3}>
                  <Link className="mb-2" href={`/products/${product._id}`}>
                    See details
                  </Link>
                </Stack>
                {product.reservation ? (
                  <Button
                    className="mt-auto mx-auto"
                    style={{ maxWidth: "130px" }}
                    variant="warning"
                    onClick={handleReserve}
                    disabled={isActive}
                  >
                    Reserve
                  </Button>
                ) : (
                  <p>❌ No Reservations</p>
                )}
              </Card.Body>
            </Col>
            <Col sm={6} className="d-flex-column justify-content-center" md={4}>
              <Card.Title className="mt-3">Seller</Card.Title>
              <div>{product.seller.name}</div>
              {sellerAddress && (
                <Link
                  className="mb-2"
                  href={`https://maps.google.com/?q=${sellerAddress}`}
                  target="_blank"
                >
                  {sellerAddress}
                </Link>
              )}

              {shouldRunCountdown && (
                <Container className="d-inline-flex justify-content-center">
                  <Card.Subtitle
                    className="text-xl mt-4 mx-2"
                    style={{ fontSize: "1.2rem", fontWeight: "bold" }}
                  >
                    {formattedTime}
                  </Card.Subtitle>

                  <div className="mt-3 flex space-x-2">
                    <Button
                      className="mt-auto mx-auto"
                      style={{ maxWidth: "130px" }}
                      variant="primary"
                      // onClick={handle}
                      onClick={handleCancelReservation}
                    >
                      Cancel
                    </Button>
                  </div>
                </Container>
              )}
              {reservationStatus === "cancelled" && (
                <div
                  className="mt-2"
                  style={{ color: "red", textAlign: "center" }}
                >
                  Reservation Cancelled
                </div>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ProductCardList;
