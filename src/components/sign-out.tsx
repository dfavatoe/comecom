"use client";
import { signOut } from "next-auth/react";
import { Button } from "react-bootstrap";
import "@/app/globals.css";

export function SignOut() {
  return (
    <>
      <Button
        variant="link"
        onClick={() => {
          signOut().then(() => {
            console.log("👋 User has been signed out!");
          });
        }}
        style={{
          textDecoration: "none",
          color: "var(--primary)",
          padding: 0,
        }}
      >
        <b>&nbsp; Log Out</b>
      </Button>
    </>
  );
}
