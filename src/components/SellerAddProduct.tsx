"use client";

import { addProductT } from "@/model/types/types";
import React, { ChangeEvent, FormEvent, MouseEvent, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Image,
  InputGroup,
  Row,
} from "react-bootstrap";
import { useSession } from "next-auth/react";
import { baseUrl } from "@/app/lib/urls";

export default function SellerAddProduct() {
  const { data: session, status } = useSession();
  const [newProduct, setNewProduct] = useState<addProductT | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | string>("");

  //?======================================================================

  //add data to newProduct, converting the necessary values to number
  const handleNewProductInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setNewProduct((prev) => ({
      ...prev!,
      [name]: type === "number" ? Number(value) : value, // Convert price to number
      seller: session?.user!.id as string,
    }));
    console.log("newUserName :>> ", newProduct);
  };

  //?======================================================================

  const handleReserveButtonChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.checked :>> ", e.target.checked);
    setNewProduct({ ...newProduct!, reservation: e.target.checked }); //sets reservation to true or false
  };

  //?====================================================================

  const handleAttachFile = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log("e.target :>> ", e);
    const file = e.target.files?.[0];
    if (file instanceof File) {
      console.log("selected file set");
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("selectedFile :>> ", selectedFile);

    const formData = new FormData();
    formData.append("file", selectedFile);

    const requestOptions = {
      method: "POST",
      body: formData,
    };

    try {
      const response = await fetch(
        `${baseUrl}/api/upload/image-product`,
        requestOptions
      );

      const result = await response.json();

      setNewProduct({ ...newProduct!, images: Array(result.url) });

      console.log("result :>> ", result);
      console.log("newProduct :>> ", newProduct);
    } catch (error) {
      console.log("error :>> ", error);
    } finally {
      //delete the image preview
      if (typeof imagePreview === "string") {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
    }
  };

  const submitNewProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // if (!token) {
    //   console.log("user has to log in first");
    //   setAlertText("You have to log in first.");
    //   setShowAlert(true);
    //   return;
    // }

    // const requestOptions = {
    //   method: "PUT",
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(newProduct), // Send as JSON
    // };

    // const response = await fetch(
    //   `${baseUrl}/api/products/add-product`,
    //   requestOptions
    // );

    // const result = (await response.json()) as PutUpdateResponse;
    // console.log("add product result :>> ", result);

    // if (response.ok) {
    //   console.log("Product added successfully!");
    //   setAlertText("Product successfully added!");
    //   setShowAlert(true);
    //   setNewProduct(null);
    // } else {
    //   console.log(result.error || "Failed to add the product.");
    // }
  };

  return (
    <Container>
      <h2 className="second-header ml-0 mb-4">Add Products</h2>
      <Row>
        <Col sm={6} className="mx-0 px-0 g-0" style={{ textAlign: "left" }}>
          <h5>Specifications:</h5>
          <Form onSubmit={submitNewProduct}>
            <Row>
              <Col>
                <Form.Group className="mb-3 justify-content-center">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    id="product-title"
                    placeholder="Enter the product's title"
                    onChange={handleNewProductInputChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3 justify-content-center">
                  <Form.Label>Brand</Form.Label>
                  <Form.Control
                    type="text"
                    name="brand"
                    id="product-brand"
                    placeholder="Enter the product's brand"
                    onChange={handleNewProductInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3 justify-content-center">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                id="product-description"
                // value={email}
                // onChange={handleEmailChange}
                placeholder="Describe the product"
                onChange={handleNewProductInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                id="product-category"
                // value={password}
                // onChange={handlePasswordChange}
                placeholder="Set the product's category"
                onChange={handleNewProductInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="text"
                name="price"
                id="product-price"
                // value={password}
                // onChange={handlePasswordChange}
                placeholder="Set a price"
                onChange={handleNewProductInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                id="product-stock"
                // value={password}
                // onChange={handlePasswordChange}
                placeholder="Number of product's in stock"
                onChange={handleNewProductInputChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Image</Form.Label>
              <Form.Group controlId="formFile" className="mb-3">
                <InputGroup className="mb-4">
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleAttachFile}
                  />
                  <Button
                    type="submit"
                    variant="outline-secondary"
                    id="button-addon2"
                    onClick={handleImageUpload}
                  >
                    Upload
                  </Button>
                </InputGroup>
                <div>
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="image preview"
                      style={{
                        width: "70px",
                        height: "auto",
                        border: "solid",
                      }}
                    />
                  )}
                </div>
              </Form.Group>
            </Form.Group>
            <Button
              type="submit"
              className="d-flex ml-2 mb-3 justify-content-end"
            >
              Add Product
            </Button>
          </Form>
        </Col>
        <Col sm={6} style={{ textAlign: "left" }}>
          <h5>Product Details:</h5>
          <Form.Group
            className="mx-0 mb-3 px-0 g-0"
            style={{ textAlign: "left" }}
          >
            <Form.Label>Warranty</Form.Label>
            <Form.Control
              type="text"
              name="warranty"
              id="product-warranty"
              placeholder="Warranty conditions"
              onChange={handleNewProductInputChange}
            />
          </Form.Group>

          <Form.Group
            className="mx-0 mb-3 px-0 g-0"
            style={{ textAlign: "left" }}
          >
            <Form.Label>Return policy</Form.Label>
            <Form.Control
              type="text"
              name="returnPolicy"
              id="product-return"
              placeholder="Return conditions"
              onChange={handleNewProductInputChange}
            />
          </Form.Group>

          <Form.Group
            className="mx-0 mb-3 px-0 g-0"
            style={{ textAlign: "left" }}
          >
            <Form.Label>Minimum Reservation Amount</Form.Label>
            <Form.Control
              type="number"
              name="minReservationQty"
              id="product-minorder"
              placeholder="Minimum ammount of items for reservation"
              onChange={handleNewProductInputChange}
            />
          </Form.Group>

          <Form.Group
            className="mx-0 mb-3 px-0 g-0"
            style={{ textAlign: "left" }}
          >
            <Form.Label className="d-block">Dimensions (mm)</Form.Label>
            <Form.Control
              className="d-inline mx-2"
              style={{ maxWidth: "30%" }}
              type="text"
              name="width"
              id="product-width"
              placeholder="Width"
              onChange={handleNewProductInputChange}
            />
            <Form.Control
              className="d-inline"
              style={{ maxWidth: "30%" }}
              type="text"
              name="height"
              id="product-height"
              placeholder="Height"
              onChange={handleNewProductInputChange}
            />
            <Form.Control
              className="d-inline mx-2"
              style={{ maxWidth: "30%" }}
              type="text"
              name="depth"
              id="product-depth"
              placeholder="Depth"
              onChange={handleNewProductInputChange}
            />
          </Form.Group>
          <Row className="mb-3" style={{ textAlign: "left" }}>
            <Col style={{ maxWidth: "50%" }}>
              <Form.Label>Discount</Form.Label>
              <Form.Control
                type="text"
                name="discountPercentage"
                id="product-discount"
                placeholder="Discount percentage"
                onChange={handleNewProductInputChange}
              />
            </Col>
            <Col style={{ maxWidth: "50%" }}>
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="number"
                name="rating"
                id="product-rating"
                placeholder="Self-Rating"
                max={5}
                onChange={handleNewProductInputChange}
              />
            </Col>
          </Row>

          <Form.Group className="mb-4" style={{ textAlign: "left" }}>
            <Row className="mb-3" style={{ textAlign: "left" }}>
              <Form.Label className="d-block">
                Reservation (in minutes)
              </Form.Label>
              <Col style={{ maxWidth: "150px" }}>
                <Form.Check
                  style={{ width: "50px" }}
                  type="switch"
                  id="custom-switch"
                  label="Enable"
                  onChange={handleReserveButtonChange}
                />
              </Col>
              <Col>
                <Form.Control
                  className="mx-2"
                  type="number"
                  name="reservationTime"
                  id="product-rating"
                  placeholder="Reservation time"
                  onChange={handleNewProductInputChange}
                />
              </Col>
            </Row>
          </Form.Group>
        </Col>
      </Row>
    </Container>
  );
}
