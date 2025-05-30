import type { Metadata } from "next";
import { roboto } from "@/app/ui/fonts";
import "./globals.css";
import NavBar from "@/components/NavBar";
import ChatWidget from "@/components/ChatWidget";
import { ClientProviders } from "@/components/ClientProviders";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "com&com",
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
          <div className="layout-wrapper">
            <NavBar />
            <main className="main-content">
              {children}
              <ChatWidget />
            </main>
            <Footer />
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
