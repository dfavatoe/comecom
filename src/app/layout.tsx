import type { Metadata } from "next";
import { roboto } from "@/app/ui/fonts";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import NavBar from "@/components/NavBar";
import ChatWidget from "@/components/ChatWidget";
export const metadata: Metadata = {
  title: "Com&Com",
  description: "The Communication E-Commerce Plattform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased`}>
        <SessionProvider>
          <NavBar />
          {children}
          <ChatWidget />
        </SessionProvider>
      </body>
    </html>
  );
}
