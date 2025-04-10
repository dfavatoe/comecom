"use client";
// import type { Metadata } from "next";
import { roboto } from "@/app/ui/fonts";
import "./globals.css";
import { getSession, SessionProvider } from "next-auth/react";
import NavBar from "@/components/NavBar";
import SessionWrapper from "@/components/SessionWrapper";

// export const metadata: Metadata = {
//   title: "Com&Com",
//   description: "The Communication E-Commerce Plattform",
// };
const session = await getSession();
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased`}>
        {/* <SessionProvider> */}
        <SessionWrapper session={session}>
          <NavBar session={session} />
          {children}
        </SessionWrapper>

        {/* </SessionProvider> */}
      </body>
    </html>
  );
}
