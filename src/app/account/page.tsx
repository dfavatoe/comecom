"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Address,
  UpdateAddressOkResponse,
  UserFull,
} from "@/model/types/types";
import { baseUrl } from "../lib/urls";
import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import Link from "next/link";
import { useToast } from "@/hooks/useToast";
import "@/app/globals.css";

const AccountPage = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [newUserName, setNewUserName] = useState("");
  const [newAddress, setNewAddress] = useState<Address | null>(null);

  const { showToast } = useToast();

  //======================================================================

  const handleUserNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setNewUserName(e.target.value);
    console.log("newUserName :>> ", newUserName);
  };

  //======================================================================

  const submitNewName = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session!.user) {
      console.log("user has to log in first");
      showToast("You have to log in first.", "warning");

      return;
    }

    const userId = session?.user.id;

    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, newUserName }),
    };

    const response = await fetch(
      `${baseUrl}/api/users/profile/update-name`,
      requestOptions
    );
    const result = await response.json();
    if (response.ok) {
      setUser(result.user);
      showToast("Name updated successfully!", "success");
      setNewUserName("");
    } else {
      showToast(result.error || "Failed to update name.", "danger");
    }
  };

  //============================================================

  const handleAddress = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.name :>> ", e.target.name);
    console.log("e.target.value :>> ", e.target.value);
    setNewAddress({
      ...newAddress!,
      [e.target.name]: e.target.value,
    });
  };

  //============================================================

  const submitAddress = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session!.user) {
      showToast("You have to log in first.", "warning");
      return;
    }

    if (!newAddress) {
      showToast("Complete all fields", "warning");

      return;
    }

    try {
      const response = await fetch(
        `${baseUrl}/api/users/profile/update-address`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newAddress),
        }
      );

      const result = (await response.json()) as UpdateAddressOkResponse;

      if (response.ok) {
        setUser(result.user);
        showToast("Address updated successfully!", "success");
        setNewAddress(null);
      } else {
        showToast(result.error || "Failed to update address.", "danger");
      }
    } catch (error) {
      console.error("Error updating address:", error);
      showToast("Something went wrong.", "danger");
    }
    // Router.reload();
  };

  useEffect(() => {
    if (status === "authenticated") {
      const fetchUser = async () => {
        try {
          const res = await fetch(`${baseUrl}/api/users/profile`);
          if (!res.ok) throw new Error("Failed to fetch profile");
          const data = await res.json();
          setUser(data.user);
        } catch (err) {
          console.error("Error fetching profile:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    } else if (status === "unauthenticated") {
      setUser(null);
      setLoading(false);
    }
  }, [status]);

  if (loading) return <p>Loading...</p>;

  if (status === "unauthenticated")
    return (
      <Container className="d-block">
        <h4>You must be signed in to view your account.</h4>
        <div className="d-block mb-4">
          <Link className="d-inline" href={"/signup"}>
            Sign up{" "}
          </Link>
          <span>or </span>
          <Link className="d-inline" href={"/login"}>
            Log in{" "}
          </Link>
        </div>
      </Container>
    );

  return (
    <>
      <h2>Profile</h2>
      {user && (
        <>
          <Row>
            <Col sm={6} style={{ textAlign: "left" }}>
              <Image
                className="mb-4"
                style={{ width: "200px" }}
                src={user.avatar || user.image}
                alt="user profile pic"
                rounded
              />

              {/* NewName Form */}
              <Form onSubmit={submitNewName} className="mb-4">
                <h5>Personal Data:</h5>
                <Form.Label>
                  <b>Name: </b> {user.name}
                </Form.Label>
                <Form.Control
                  style={{ maxWidth: "300px" }}
                  className="mb-2 d-blockinline"
                  type="text"
                  placeholder="Enter new name"
                  value={newUserName}
                  onChange={handleUserNameChange}
                  required
                />
                <Button type="submit" className="d-block ml-2 mb-3">
                  Update
                </Button>
              </Form>
              <div className="mb-4">
                <b>Email: </b> {user.email}
              </div>
              {user.role === "seller" && (
                <div className="mb-4">
                  <b>comBay Store: </b>
                  {user.address ? (
                    <Link className="mb-2" href={`/store/${user._id}`}>
                      My Store
                    </Link>
                  ) : (
                    <p>
                      Complete the address and add products to build your store.
                    </p>
                  )}
                </div>
              )}
            </Col>
            <Col
              sm={6}
              className="d-block"
              style={{
                textAlign: "left",
              }}
            >
              {/* NewAddress Form */}
              <Form onSubmit={submitAddress} className="mb-4">
                <h5 className="mb-4">Contacts:</h5>
                <Form.Label className="d-block">
                  <b>Address: </b>{" "}
                  {user.address && (
                    <>
                      {user.address.streetName} {user.address.streetNumber}
                      {", "}
                      {user.address.postalcode} {user.address.city}
                    </>
                  )}
                </Form.Label>
                <Form.Label className="d-inline">Street Name:</Form.Label>{" "}
                <Form.Control
                  style={{ maxWidth: "300px" }}
                  className="mb-2 d-inline"
                  type="text"
                  name="streetName"
                  placeholder="Enter street name"
                  onChange={handleAddress}
                  required
                />{" "}
                <Form.Label className="d-inline">Number:</Form.Label>{" "}
                <Form.Control
                  style={{ maxWidth: "50px" }}
                  className="mb-2 d-inline"
                  type="text"
                  name="streetNumber"
                  onChange={handleAddress}
                  required
                />
                <div>
                  <Form.Label className="d-inline">City:</Form.Label>{" "}
                  <Form.Control
                    style={{ maxWidth: "300px" }}
                    className="mb-2 d-inline"
                    type="text"
                    name="city"
                    placeholder="Enter city name"
                    onChange={handleAddress}
                    required
                  />{" "}
                  <Form.Label className="d-inline">State:</Form.Label>{" "}
                  <Form.Control
                    style={{ maxWidth: "100px" }}
                    className="mb-2 d-inline"
                    type="text"
                    name="state"
                    onChange={handleAddress}
                  />{" "}
                </div>
                <div>
                  <Form.Label className="d-inline">Country:</Form.Label>{" "}
                  <Form.Control
                    style={{ maxWidth: "300px" }}
                    className="mb-2 d-inline"
                    type="text"
                    name="country"
                    placeholder="Enter country name"
                    onChange={handleAddress}
                  />{" "}
                  <Form.Label className="d-inline">Zipcode:</Form.Label>{" "}
                  <Form.Control
                    style={{ maxWidth: "100px" }}
                    className="mb-2 d-inline"
                    type="text"
                    name="postalcode"
                    onChange={handleAddress}
                    required
                  />{" "}
                </div>
                <Button type="submit" className="d-inline mb-3">
                  Update
                </Button>
                <Button
                  //onClick={deleteUserAddress}
                  className="d-inline mx-2 mb-3"
                >
                  Delete
                </Button>
              </Form>
            </Col>
          </Row>
          <hr />
        </>
      )}
    </>
  );
};

export default AccountPage;
