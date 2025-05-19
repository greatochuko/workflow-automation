import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VideoFlow",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon-2.svg" type="image/png" sizes="32x32" />
      </head>
      <body
        className={`${inter.className} flex min-h-dvh text-neutral-800 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
