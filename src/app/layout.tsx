// src/app/layout.tsx
import { Inter } from "next/font/google"; // Change this
import "./globals.css";

const inter = Inter({ subsets: ["latin"] }); // Change this

export const metadata = {
  title: "Game Release Calendar",
  description: "Upcoming game releases",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}