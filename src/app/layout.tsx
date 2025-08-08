// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header"; // <-- IMPORT HEADER
import Footer from "@/components/Footer"; // <-- IMPORT FOOTER
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Personalized Content Platform",
  description: "A modern, multi-topic content website built with Next.js and Strapi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white dark:bg-gray-900 flex flex-col min-h-screen`}>
        <Header /> {/* <-- ADD HEADER HERE */}
        <main className="flex-grow container mx-auto p-4">
          {children}
        </main>
        <Footer /> {/* <-- ADD FOOTER HERE */}
      </body>
    </html>
  );
}