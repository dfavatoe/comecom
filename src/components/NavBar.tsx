"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Link from "next/link";
import { useContext } from "react";
import {
  Button,
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Spinner,
} from "react-bootstrap";
import { SignOut } from "./sign-out";
import { useSession } from "next-auth/react";
import { auth } from "@/app/lib/auth";
import { Session } from "next-auth";
// export async function getServerSideProps(ctx) {
//   const session = await auth(ctx);
//   console.log("session :>> ", session);
//   return {
//     props: {
//       session,
//     },
//   };
// }

// import { AuthContext } from "../context/AuthContext";
// import { Link } from "react-router";
// import useUserStatus from "../hooks/useUserStatus";

function NavBar() {
  // console.log("user Name in session :>> ", session.user?.name);
  // const { logout, user } = useContext(AuthContext);
  // const { loading } = useUserStatus();
  const { data: session } = useSession();

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand href="/">comBay</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "200px" }}
              navbarScroll
            >
              {/* as={Link} is used so that the Bootstrap link behaves as a Next Link.  */}
              <Nav.Link href="/" as={Link}>
                Home
              </Nav.Link>
              <Nav.Link href="/products" as={Link}>
                Products
              </Nav.Link>
              <Nav.Link href="/post" as={Link}>
                Post
              </Nav.Link>

              <Nav.Link href="/account" as={Link}>
                Account
              </Nav.Link>
              <Nav.Link href="/productsList" as={Link}>
                List
              </Nav.Link>
              <NavDropdown title="Register" id="navbarScrollingDropdown">
                <NavDropdown.Item href="/login" as={Link}>
                  Login
                </NavDropdown.Item>
                <NavDropdown.Item href="/signup" as={Link}>
                  Sign up
                </NavDropdown.Item>
              </NavDropdown>
              <SignOut />
            </Nav>
            <div>
              {session?.user?.id ? (
                <p> Hello {session.user.name}!</p>
              ) : (
                <p>Hello!</p>
              )}
            </div>
            {/* <div className="d-lg-flex justify-content-end align-items-center">
                {loading ? (
                  <>
                    <Spinner animation="border" variant="warning" />
                    <p>...LOADING...</p>
                  </>
                ) : user ? (
                  <>
                    <div className="d-lg-inline-block">
                      Hello {user.userName}!
                    </div>
                    <Button
                      style={{ color: "orange" }}
                      onClick={logout}
                      variant="none"
                    >
                      <b>Log Out</b>
                    </Button>
                  </>
                ) : (
                  <Nav.Link href="/login">
                    Hello!
                    <span style={{ color: "orange" }}>
                      {" "}
                      <b>Log in</b>{" "}
                    </span>{" "}
                  </Nav.Link>
                )}
              </div> */}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBar;
