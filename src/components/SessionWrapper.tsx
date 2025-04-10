"use client";
import { Session } from "next-auth";
import { getSession, SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";
// const session = await getSession();
console.log("session :>> ", session);
async function SessionWrapper({
  session,
  children,
}: {
  session: Session;
  children: ReactNode;
}) {
  // const session = await getSession();
  return <SessionProvider>{children}</SessionProvider>;
}

export default SessionWrapper;
