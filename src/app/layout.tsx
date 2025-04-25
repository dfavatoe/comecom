import type { Metadata } from "next";
import { roboto } from "@/app/ui/fonts";
import "./globals.css";
import NavBar from "@/components/NavBar";
import ChatWidget from "@/components/ChatWidget";
import { ClientProviders } from "@/components/ClientProviders";

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
        <ClientProviders>
          <NavBar />
          {children}
          <ChatWidget />
        </ClientProviders>
      </body>
    </html>
  );
}
