"use client";
import { useCallback, useEffect, useState } from "react";
import { GetShopInfo, ProductT, UserFull } from "@/model/types/types";
import { Col, Container, Image, Row, Spinner } from "react-bootstrap";
import ProductCardStore from "@/components/ProductCardStore";
import { baseUrl } from "@/app/lib/urls";
import Link from "next/link";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import StartChatButton from "@/components/StartChatButton";
import "@/app/globals.css";

const MapClient = dynamic(() => import("@/components/MapClient"), {
  ssr: false,
});

export default function Store() {
  const { sellerId } = useParams<{ sellerId: string }>();
  console.log("sellerId :>> ", sellerId);

  const { data: session } = useSession();

  const [seller, setSeller] = useState<UserFull | null>(null);
  const [products, setProducts] = useState<ProductT[] | null>(null);

  // Wrap handleGetSellerShopInfo in useCallback to memoize the function (and avoid warnings in Vercel)
  const handleGetSellerShopInfo = useCallback(async () => {
    if (sellerId) {
      try {
        const response = await fetch(`${baseUrl}/api/store/${sellerId}`);
        console.log("response :>> ", response);
        if (!response.ok) {
          console.log("Something went wrong");
          return;
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
  }, [sellerId, baseUrl]);

  useEffect(() => {
    handleGetSellerShopInfo();
  }, [handleGetSellerShopInfo]);

  if (!session?.user) {
    return <div>Not authenticated</div>;
  }

  const sellerAddress = seller?.address
    ? `${seller.address.streetName} ${seller.address.streetNumber}, ${seller.address.postalcode} ${seller.address.city}`
    : "";

  if (!products)
    return (
      <div className="d-flex flex-column align-items-center justify-content-center">
        <Spinner animation="border" variant="warning" />
        <p className="mt-2">Loading...</p>
      </div>
    );

  return (
    <>
      {console.log("seller>>>>>", seller)}
      {seller && (
        <>
          <div>
            <Row
              className="align-content-center mb-4"
              style={{ height: "auto" }}
            >
              {seller.storeCoverImage ? (
                <Image
                  className="mb-4"
                  src={seller.storeCoverImage}
                  alt="Store's cover image"
                  style={{ height: "350px", objectFit: "cover" }}
                />
              ) : (
                <Image
                  className="mb-4"
                  src={seller.image}
                  alt="Store's logo"
                  style={{ height: "300px", objectFit: "cover" }}
                />
              )}

              <h1 className="second-header" style={{ textAlign: "center" }}>
                {seller.name}
              </h1>
              <h2 className="third-header" style={{ textAlign: "center" }}>
                Store
              </h2>
            </Row>
            <hr />
            <Container>
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
            </Container>
            <hr />
            <h2 className="second-header mb-4" style={{ textAlign: "center" }}>
              Products
            </h2>
            <div
              style={{
                width: "auto",
                height: "auto",
                textAlign: "left",
                paddingInline: "30px",
                background: "var(--secondary)",
              }}
            >
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
                <h2>Seller didn&apos;t share any product yet.</h2>
              )}
            </div>

            <div style={{ padding: "2rem" }}>
              {sellerId && <StartChatButton sellerId={sellerId} />}
            </div>
          </div>
        </>
      )}
    </>
  );
}
