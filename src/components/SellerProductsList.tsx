"use client";
import {
  addProductT,
  GETSellersProdutsResponse,
  ProductT,
  Reservation,
} from "@/model/types/types";
import React, {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  useEffect,
  useState,
} from "react";
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import { useSession } from "next-auth/react";
import { baseUrl } from "@/app/lib/urls";
import DeleteIcon from "@mui/icons-material/Delete";
import { useToast } from "@/hooks/useToast";

export default function SellerProductsList() {
  const { data: session } = useSession();
  const [newProduct, setNewProduct] = useState<addProductT | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | string>("");

  const [sellerProducts, setSellerProducts] = useState<ProductT[]>([]);
  const [sellerReservations, setSellerReservations] = useState<Reservation[]>(
    []
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editedProducts, setEditedProducts] = useState<
    Record<string, Partial<ProductT>>
  >({});
  const { showToast } = useToast();

  //?======================================================================

  //Fetch seller's reservations
  const getSellerReservations = async () => {
    if (!session?.user?.id) return;

    const response = await fetch(
      `${baseUrl}/api/reservations/seller?sellerId=${session.user.id}`
    );
    const result = await response.json();

    if (response.ok) {
      setSellerReservations(result.reservations as Reservation[]);
    } else {
      showToast(result.error || "Error fetching reservations", "danger");
    }
  };

  useEffect(() => {
    getSellerReservations();
  }, [session]);

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

  //?====================================================================

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

  //?====================================================================

  const submitNewProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session?.user) {
      console.log("user has to log in first");
      showToast("You have to log in first!", "warning");
      return;
    }

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct), // Send as JSON
    };

    const response = await fetch(
      `${baseUrl}/api/products/create-product`,
      requestOptions
    );

    const result = await response.json(); //as PutUpdateResponse;
    console.log("add product result :>> ", result);

    if (response.ok) {
      console.log("Product added successfully!");
      showToast("Product successfully added!", "success");
      setNewProduct(null);
    } else {
      console.log(result.error || "Failed to add the product.");
      showToast("Error adding products!", "danger");
    }
  };

  //* ====================================================================

  const getSellersProducts = async () => {
    const response = await fetch(`${baseUrl}/api/products-list/seller`, {
      method: "GET",
    });

    const result = (await response.json()) as GETSellersProdutsResponse;

    if (response.ok) {
      console.log("Products List successfully fetched: ", result);
      setSellerProducts(result.products);
    } else {
      console.log("Failed to fetch the products");
    }
  };

  const handleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  //* ====================================================================

  const handleDeleteSelected = async () => {
    setIsDeleting(true);

    const res = await fetch("/api/products-list/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selectedIds) }),
    });

    if (res.ok) {
      setSellerProducts(
        (prev) =>
          prev?.filter((product) => !selectedIds.has(product._id)) ?? null
      );
      setSelectedIds(new Set());
    } else {
      console.error("Failed to delete products");
    }
    setIsDeleting(false);
    setShowConfirmModal(false);
  };

  //* ====================================================================

  const handleFieldChange = <K extends keyof ProductT>(
    productId: string,
    field: K,
    value: ProductT[K]
  ) => {
    setEditedProducts((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  //* ====================================================================

  const handleUpdateProduct = async (productId: string) => {
    const updates = editedProducts[productId];
    if (!updates) return;

    const res = await fetch(`${baseUrl}/api/products-list/update`, {
      method: "PUT",
      headers: { "Content-Type": "aplication/json" },
      body: JSON.stringify({ id: productId, updates }),
    });

    if (res.ok) {
      //Apply changes locally
      setSellerProducts((prev) =>
        prev?.map((p) => (p._id === productId ? { ...p, ...updates } : p))
      );

      //Clear edit buffer
      setEditedProducts((prev) => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });

      showToast("Product updated!", "success");
    } else {
      console.log("Failed to update product");
      showToast("Failed to update product.", "danger");
    }
  };

  //* ====================================================================

  const handleCancelReservation = async (reservationId: string) => {
    const response = await fetch(`${baseUrl}/api/reservations/cancel`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reservationId }),
    });

    const result = await response.json();

    if (response.ok) {
      showToast("Reservation cancelled!", "success");
      setSellerReservations((prev) =>
        prev.filter((r) => r._id !== reservationId)
      );
    } else {
      showToast(result.error || "Failed to cancel reservation", "danger");
    }
  };

  useEffect(() => {
    getSellersProducts();
  }, []);

  return (
    <>
      {/* Add Product */}
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
      <hr />
      {/* Products Table */}
      <Container>
        <h2 className="second-header ml-0 mb-4">Products List</h2>
        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price(€)</th>
              <th>Discount(%)</th>
              <th>Stock</th>
              <th>Reservation (min)</th>
              <th>{/* Update Buttons */}</th>
              <th>
                <Button
                  variant="danger"
                  onClick={() => setShowConfirmModal(true)}
                  disabled={selectedIds.size === 0} // disable it unless there are selected items
                >
                  <DeleteIcon />
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sellerProducts?.map((product, index) => {
              const edited = editedProducts[product._id] || {};

              return (
                <tr className="text-center" key={product._id}>
                  <td>{index + 1}</td>

                  <td>
                    <input
                      type="text"
                      value={edited.title ?? product.title}
                      onChange={(e) =>
                        handleFieldChange(product._id, "title", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      value={edited.category ?? product.category}
                      onChange={(e) =>
                        handleFieldChange(
                          product._id,
                          "category",
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      value={edited.price ?? product.price.toFixed(2)}
                      onChange={(e) =>
                        handleFieldChange(
                          product._id,
                          "price",
                          parseFloat(e.target.value)
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      value={
                        edited.discountPercentage ?? product.discountPercentage
                      }
                      onChange={(e) =>
                        handleFieldChange(
                          product._id,
                          "discountPercentage",
                          parseFloat(e.target.value)
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      value={edited.stock ?? product.stock}
                      onChange={(e) =>
                        handleFieldChange(
                          product._id,
                          "stock",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      value={edited.reservationTime ?? product.reservationTime}
                      onChange={(e) =>
                        handleFieldChange(
                          product._id,
                          "reservationTime",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </td>

                  <td>
                    <Button
                      variant="primary"
                      onClick={() => handleUpdateProduct(product._id)}
                      disabled={!editedProducts[product._id]}
                    >
                      Update
                    </Button>
                  </td>

                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(product._id)}
                      onChange={() => handleSelect(product._id)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        {/* Delete Confirmation */}
        <Modal
          show={showConfirmModal}
          onHide={() => setShowConfirmModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete <strong>{selectedIds.size}</strong>{" "}
            selected product(s)?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowConfirmModal(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteSelected}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
      <hr />
      {/* Reservation List */}
      <Container>
        <h2 className="ml-0 mb-4">Reservations</h2>
        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Product Name</th>
              <th>Buyer ID</th>
              <th>Status</th>
              <th>Expiration Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sellerReservations.map((reservation, index) => (
              <tr key={reservation._id}>
                <td>{index + 1}</td>
                <td>{reservation.productId.title}</td>
                <td>{reservation.buyerId}</td>
                <td>{reservation.status}</td>
                <td>{new Date(reservation.expiresAt).toLocaleString()}</td>
                <td>
                  <Button
                    onClick={() => {
                      handleCancelReservation(reservation._id);
                    }}
                  >
                    Cancel
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
}
