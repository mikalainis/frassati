import type { Metadata } from "next";
import { Fraunces, Figtree } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz"]
});
const body = Figtree({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  metadataBase: new URL("https://frassatinj.com"),
  title: {
    default: "Frassati Fellowship of New Jersey — Verso l'alto",
    template: "%s · Frassati Fellowship NJ"
  },
  description:
    "A fellowship of Catholics drawn to the mountains and to the Mass, climbing together toward the Kingdom of God. Somerset Hill Deanery, Diocese of Metuchen.",
  openGraph: {
    title: "Frassati Fellowship of New Jersey",
    description:
      "A fellowship of Catholics drawn to the mountains and to the Mass — prayer, service of the poor, love of the Church, and the outdoors.",
    url: "https://frassatinj.com",
    siteName: "Frassati Fellowship NJ",
    type: "website"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body antialiased">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
