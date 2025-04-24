"use client";
import { useEffect, useState } from "react";
import { GetShopInfo, ProductT, UserFull } from "@/model/types/types";
import { Col, Container, Image, Row } from "react-bootstrap";
import ProductCardStore from "@/components/ProductCardStore";
import { baseUrl } from "@/app/lib/urls";
import Link from "next/link";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import StartChatButton from "@/components/StartChatButton";

const MapClient = dynamic(() => import("@/components/MapClient"), {
  ssr: false,
});

export default function Store() {
  const { sellerId } = useParams<{ sellerId: string }>();
  console.log("sellerId :>> ", sellerId);

  const [messages, setMessages] = useState<any[]>([]); // Zustand für Nachrichten
  const [lastTimestamp, setLastTimestamp] = useState<number | null>(null);

  const { data: session } = useSession(); // Authentifizierte Session holen
  const [chatroomId, setChatroomId] = useState<string | null>(null); // Zustand für die chatroomId

  const [seller, setSeller] = useState<UserFull | null>(null);
  const [products, setProducts] = useState<ProductT[] | null>(null);

  const handleGetSellerShopInfo = async () => {
    if (sellerId) {
      try {
        const response = await fetch(`${baseUrl}/api/store/${sellerId}`);
        console.log("response :>> ", response);
        if (!response.ok) {
          console.log("Something went wrong");
        }
        const result = (await response.json()) as GetShopInfo;
        console.log("result Shop :>> ", result);
        setSeller(result.sellerInfo);
        setProducts(result.productsBySeller);
      } catch (error) {
        console.log("error :>> ", error);
      }
    } else {
      console.log("A seller's ID is necessary in the URL");
    }
  };

  const fetchChat = async () => {
    if (!chatroomId) return;

    try {
      const query = lastTimestamp ? `?after=${lastTimestamp}` : "";
      const res = await fetch(`/api/chatroom/${chatroomId}/message${query}`);
      if (!res.ok) {
        console.error("Fehler beim Abrufen der Nachrichten");
        return;
      }

      const newMessages = await res.json();

      if (newMessages.length > 0) {
        setMessages((prev) => [...prev, ...newMessages]);

        const latest = newMessages[newMessages.length - 1];
        setLastTimestamp(new Date(latest.createdAt).getTime());
      }
    } catch (err) {
      console.error("fetchChat error:", err);
    }
  };

  // Lade die Nachrichten, wenn die chatroomId vorhanden ist
  // useEffect(() => {
  //   if (chatroomId) {
  //     fetchChat();
  //   }
  // }, [chatroomId]);

  // Polling für das Abrufen der Nachrichten alle 3 Sekunden
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetchChat(); // Ruft alle 3 Sekunden die Nachrichten ab
  //   }, 1000);

  //   // Cleanup: Wenn der Component unmounted wird, das Intervall aufräumen
  //   return () => clearInterval(interval);
  // }, [chatroomId]); // Polling läuft nur, wenn sich die chatroomId ändert

  useEffect(() => {
    handleGetSellerShopInfo();
  }, []);

  if (!session?.user) {
    return <div>Not authenticated</div>;
  }

  const sellerAddress = seller?.address
    ? `${seller.address.streetName} ${seller.address.streetNumber}, ${seller.address.postalcode} ${seller.address.city}`
    : "";

  return (
    <>
      {console.log("seller>>>>>", seller)}
      {seller && (
        <>
          <Container>
            <Row
              className="align-content-center mb-4"
              style={{ height: "auto" }}
            >
              <Image
                className="mb-4"
                src={seller.image}
                style={{ height: "300px", objectFit: "cover" }}
              />
              <div className="second-header" style={{ textAlign: "center" }}>
                {seller.name}
              </div>
              <div className="third-header" style={{ textAlign: "center" }}>
                Store
              </div>
            </Row>
            <hr />
            <Row>
              <Col
                sm={6}
                className="d-block mb-2"
                style={{ textAlign: "left" }}
              >
                <h4>Contacts</h4>
                <h5>{seller.email}</h5>
                {sellerAddress && (
                  <Link
                    className="mb-2"
                    href={`https://maps.google.com/?q=${sellerAddress}`}
                    target="_blank"
                  >
                    {sellerAddress}
                  </Link>
                )}
              </Col>
              <Col>
                <MapClient
                  lat={seller.address?.latitude ?? 52.5200066}
                  lng={seller.address?.longitude ?? 13.404954}
                  label={
                    seller.address
                      ? seller.name
                      : "No location shared by seller"
                  }
                />
              </Col>
            </Row>
            <hr />
            <div className="second-header mb-4" style={{ textAlign: "center" }}>
              Products
            </div>
            {products ? (
              products.map((product) => {
                return (
                  <Row
                    className="d-flex justify-content-center"
                    key={product._id}
                  >
                    <ProductCardStore key={product._id} product={product} />
                  </Row>
                );
              })
            ) : (
              <h2>Seller still didn't share the products</h2>
            )}
          </Container>
          <div style={{ padding: "2rem" }}>
            {sellerId && <StartChatButton sellerId={sellerId} />}
          </div>
        </>
      )}
    </>
  );
}
