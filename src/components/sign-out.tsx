"use client";
import { signOut } from "next-auth/react";

export function SignOut() {
  return (
    <button
      onClick={() =>
        signOut().then(() => {
          console.log("👋 User has been signed out!");
          alert("Signed out successfully!");
        })
      }
    >
      Sign Out
    </button>
  );
}
