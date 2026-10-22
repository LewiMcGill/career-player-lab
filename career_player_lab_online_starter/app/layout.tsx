import type { Metadata } from "next"; import "./globals.css";
export const metadata: Metadata = { title:"Career Player Lab", description:"FIFA Career Mode player progression and trait manager" };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="id"><body>{children}</body></html>; }
