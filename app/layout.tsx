import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "./components/CartProvider";
export const metadata: Metadata = { title:"PintoExpress | Balcão Avícola", description:"Pintos, nutrição e soluções avícolas em Moçambique." };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt"><body><CartProvider>{children}</CartProvider></body></html>}
