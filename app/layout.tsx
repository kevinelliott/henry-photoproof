import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PhotoProof — Photo Proofing Made Simple",
  description: "Share galleries, get client approvals, never start editing too early",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col font-sans antialiased">{children}</body>
    </html>
  );
}
