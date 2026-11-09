import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "./components/CartProvider";

export const metadata: Metadata = {
  title: "PintoExpress | Balcão Avícola",
  description: "Pintos, nutrição e soluções avícolas em Moçambique.",
  applicationName: "PintoExpress",
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
  themeColor: "#0b4128",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-MZ"><body><CartProvider>{children}</CartProvider></body></html>;
}
