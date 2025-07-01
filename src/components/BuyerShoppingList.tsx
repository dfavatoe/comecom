import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { GetProductsListResponse, ProductsList } from "@/model/types/types";
import { Button, Container, Row, Spinner } from "react-bootstrap";
import { useRouter } from "next/navigation";
import ProductCardList from "@/components/ProductCardList";

export default function BuyerShoppingList() {
  const { data: session, status } = useSession();
  const [productsList, setProductsList] = useState<ProductsList[] | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  //const [reservations, setReservations] = useState<Reservation[] | null>(null);
  const [reservationStatuses, setReservationStatuses] = useState<
    Record<string, string>
  >({});

  const handleGetShoppingList = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products-list`, {
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

  const handleGetBuyerReservations = async () => {
    try {
      if (!session?.user!.id) return;
      // GET is used here for the "Auto-Cancel expired reservations" function" from the API. Not necessarily to obtain a reservation's list, like for the seller.
      const response = await fetch(
        `/api/reservations?buyerId=${session?.user!.id}`,
        { method: "GET" }
      );
      if (!response.ok) {
        console.error("Error fetching reservations");
        return;
      }
      const data = await response.json();
      console.log("Fetched buyer reservations", data.reservations);
      //setReservations(data.reservations);
    } catch (error) {
      console.error("Error fetching buyer reservations", error);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      handleGetShoppingList();
      handleGetBuyerReservations();
    }
  }, [status, session?.user!.id]);

  //polling: check every 10 seconds the reservation status
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `/api/reservations?buyerId=${session?.user!.id}`
        );
        const data = await response.json();

        if (response.ok) {
          const updatedStatuses: Record<string, string> = {};

          for (const reservation of data.reservations) {
            if (reservation.status === "cancelled") {
              updatedStatuses[reservation.productId] = "cancelled";

              // Clear countdown from sessionStorage
              sessionStorage.removeItem(`countdown_${reservation.productId}`);
            }
          }

          setReservationStatuses(updatedStatuses);
        } else {
          console.error("Failed to fetch reservations");
        }
      } catch (error) {
        console.error("Error checking reservation status", error);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [session?.user!.id]);

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
              <ProductCardList
                key={item._id}
                product={item}
                reservationStatus={reservationStatuses[item._id]}
              />
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
