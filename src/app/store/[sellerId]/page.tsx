"use client";
import { useEffect, useState } from "react";
import { GetShopInfo, ProductT, UserFull } from "@/model/types/types";
import { Col, Container, Image, Row } from "react-bootstrap";
import ProductCardStore from "@/components/ProductCardStore";
import { baseUrl } from "@/app/lib/urls";
import Link from "next/link";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

const MapClient = dynamic(() => import("@/components/MapClient"), {
  ssr: false,
});

export default function Store() {
  const { sellerId } = useParams<{ sellerId: string }>();
  console.log("sellerId :>> ", sellerId);

  const [seller, setSeller] = useState<UserFull | null>(null);
  const [products, setProducts] = useState<ProductT[] | null>(null);

  const sellerAddress = seller?.address
    ? `${seller.address.streetName} ${seller.address.streetNumber}, ${seller.address.postalcode} ${seller.address.city}`
    : "";

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

  useEffect(() => {
    handleGetSellerShopInfo();
  }, []);

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
              {seller.storeCoverImage ? (
                <Image
                  className="mb-4"
                  src={seller.storeCoverImage}
                  style={{ height: "300px", objectFit: "cover" }}
                />
              ) : (
                <Image
                  className="mb-4"
                  src={seller.image}
                  style={{ height: "300px", objectFit: "cover" }}
                />
              )}

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
        </>
      )}
    </>
  );
}
