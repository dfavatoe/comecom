import { ProductT } from "@/model/types/types";
import { Col, Container, Row } from "react-bootstrap";

import ProductCard from "@/components/ProductCard";

type GridProps = {
  products: ProductT[];
};

function Grid({ products }: GridProps) {
  return (
    <Container className="justify-content-center">
      <Row className="g-1">
        {products &&
          products.map((product) => {
            return (
              <Col className="d-flex justify-content-center" key={product._id}>
                <ProductCard key={product._id} product={product} />
              </Col>
            );
          })}
      </Row>
    </Container>
  );
}

export default Grid;
