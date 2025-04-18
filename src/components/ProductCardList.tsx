import { Button, Card, Col, Container, Row, Stack } from "react-bootstrap";
import { ProductsList } from "@/model/types/types";
import style from "./productcard.module.css";
import Link from "next/link";
import { useCountdown } from "@/hooks/useCountdown";

type ProductCardProps = {
  product: ProductsList;
};

function ProductCardList({ product }: ProductCardProps) {
  const { formattedTime, start, reset, isActive } = useCountdown(
    product.reservationTime,
    `countdown_${product._id}` // Unique storage key for each product
  );

  const sellerAddress = product.seller?.address
    ? `${product.seller.address.streetName} ${product.seller.address.streetNumber}, ${product.seller.address.postalcode} ${product.seller.address.city}`
    : "";

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
                    onClick={start}
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

              {product.reservation && (
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
                      onClick={reset}
                    >
                      Cancel
                    </Button>
                  </div>
                </Container>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ProductCardList;
