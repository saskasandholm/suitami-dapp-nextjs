import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "@/components/layout/Layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Suitami - AI Agents for Web3 Communities",
  description: "Deploy autonomous AI agents to manage and grow your Web3 community",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gradient-to-b from-[#011829] via-[#030f1c] to-black text-white antialiased`}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
