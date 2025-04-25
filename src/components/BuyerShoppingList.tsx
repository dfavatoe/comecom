import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { baseUrl } from "@/app/lib/urls";
import { GetProductsListResponse, ProductsList } from "@/model/types/types";
import { Button, Container, Row, Spinner } from "react-bootstrap";
import { useRouter } from "next/navigation";
import ProductCardList from "@/components/ProductCardList";

export default function BuyerShoppingList() {
  const { data: session, status } = useSession();
  const [productsList, setProductsList] = useState<ProductsList[] | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleGetShoppingList = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/api/products-list`, {
        method: "GET",
      });
      if (!response.ok) {
        console.log("Something went wrong while fetching the list");
        setLoading(false);
        return;
      }

      const result = (await response.json()) as GetProductsListResponse;
      console.log("result :>> ", result);
      if (result.amount === 0) {
        console.log("The list is empty");
      }
      setProductsList(result.records);
    } catch (error) {
      console.error("Error fetching the list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      handleGetShoppingList();
    }
  }, []);

  return (
    <>
      <Container className="justify-content-center">
        <h2 className="mb-4" style={{ textAlign: "center" }}>
          Shopping List
        </h2>
        {loading ? (
          <div className="d-flex flex-column align-items-center justify-content-center">
            <Spinner animation="border" variant="warning" />
            <p className="mt-2">Loading...</p>
          </div>
        ) : productsList && productsList.length > 0 ? (
          productsList.map((item) => (
            <Row className="d-flex justify-content-center m-4" key={item._id}>
              <ProductCardList key={item._id} product={item} />
            </Row>
          ))
        ) : (
          <>
            <Container className="d-block text-center">
              <h5 className="mb-4">Your list is empty</h5>
              <Button
                onClick={() => router.push("/products")}
                type="button"
                className="mb-4"
                variant="warning"
              >
                Continue shopping
              </Button>
            </Container>
          </>
        )}
      </Container>
    </>
  );
}
