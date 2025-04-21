import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { baseUrl } from "@/app/lib/urls";
import { GetProductsListResponse, ProductsList } from "@/model/types/types";
import { Button, Container, Row } from "react-bootstrap";
import { useRouter } from "next/navigation";
import ProductCardList from "@/components/ProductCardList";

export default function BuyerShoppingList() {
  const { data: session, status } = useSession();
  const [productsList, setProductsList] = useState<ProductsList[] | null>(null);

  const router = useRouter();

  const handleGetShoppingList = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/products-list`, {
        method: "GET",
      });
      if (!response.ok) {
        console.log("Something went wrong while fetching the list");
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
        {productsList ? (
          productsList.map((item) => {
            return (
              <Row className="d-flex justify-content-center m-4" key={item._id}>
                <ProductCardList key={item._id} product={item} />
              </Row>
            );
          })
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
