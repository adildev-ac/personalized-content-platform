// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { validateEnvironment } from "@/lib/env"; // Import environment validator
import "./globals.css";
import "./giscus-custom.css"; // Custom styling for Giscus comments

// Validate environment variables during build/startup
validateEnvironment();

const inter = Inter({ subsets: ["latin"] });

// Set strict CSP nonce for enhanced security in production
const nonce = process.env.NODE_ENV === 'production' ? 
  Buffer.from(crypto.randomUUID()).toString('base64') : undefined;

export const metadata: Metadata = {
  title: "Personalized Content Platform",
  description: "A modern, multi-topic content website built with Next.js and Strapi.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
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