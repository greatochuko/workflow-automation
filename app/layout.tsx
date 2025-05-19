import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar/Sidebar";
import { getUser } from "@/services/authServices";
import SidebarProvider from "@/context/SidebarContext";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VideoFlow",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: user } = await getUser();

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon-2.svg" type="image/png" sizes="32x32" />
      </head>
      <body
        className={`${inter.className} flex min-h-dvh text-neutral-800 antialiased`}
      >
        <SidebarProvider>
          {user && <Sidebar user={user} />}
          <div className="flex flex-1">{children}</div>
        </SidebarProvider>
      </body>
    </html>
  );
}
