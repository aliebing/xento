import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Xento IT-Solutions | Softwareentwicklung & Beratung",
  description:
    "Xento IT-Solutions – Softwareentwicklung, Architekturberatung und Support für Symfony, Laravel und Vue.js. Über 20 Jahre Erfahrung, Karlsruhe (vor Ort & remote).",
  openGraph: {
    title: "Xento IT-Solutions | Softwareentwicklung & Beratung",
    description:
      "Softwareentwicklung, Architekturberatung und Support für Symfony, Laravel und Vue.js aus Karlsruhe.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
