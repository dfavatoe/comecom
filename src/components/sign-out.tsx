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
            alert("Signed out successfully!");
          });
        }}
        style={{
          textDecoration: "none",
          color: "orange",
          padding: 0,
        }}
      >
        <b>Log Out</b>
      </Button>
    </>
  );
}
