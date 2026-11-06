import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title:"PintoExpress", description:"Pintos e insumos avícolas em Moçambique" };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt"><body>{children}</body></html>}
