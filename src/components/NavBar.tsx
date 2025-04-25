"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Link from "next/link";
import { Container, Nav, Navbar, NavDropdown, Button } from "react-bootstrap";
import { useSession } from "next-auth/react";
import { SignOut } from "./sign-out";
import "@/app/globals.css";

function NavBar() {
  const { data: session } = useSession();

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand style={{ color: "var(--primary)" }} href="/">
          com&com
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse className="text-center" id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "200px" }}
            navbarScroll
          >
            <Nav.Link href="/" as={Link}>
              Home
            </Nav.Link>
            <Nav.Link href="/products" as={Link}>
              Products
            </Nav.Link>
            <Nav.Link href="/post" as={Link}>
              Social
            </Nav.Link>
            <Nav.Link href="/account" as={Link}>
              Account
            </Nav.Link>
            <NavDropdown title="Register" id="navbarScrollingDropdown">
              <NavDropdown.Item href="/login" as={Link}>
                Login
              </NavDropdown.Item>
              <NavDropdown.Item href="/signup" as={Link}>
                Sign up
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

          <div className="d-flex align-items-center gap-2">
            {session?.user ? (
              <>
                <span className="mb-0">Hello {session.user.name}!</span>
                <SignOut />
              </>
            ) : (
              <Nav.Link href="/login" as={Link}>
                Hello!{" "}
                <span style={{ color: "var(--primary)" }}>
                  <b>Log in</b>
                </span>
              </Nav.Link>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
