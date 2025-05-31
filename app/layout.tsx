import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar/Sidebar";
import { getSession } from "@/services/authServices";
import SidebarProvider from "@/context/SidebarContext";
import { Toaster } from "sonner";
import InvalidSessionModal from "@/components/auth/InvalidSessionModal";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VidLeads",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: user } = await getSession();

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon-2.svg" type="image/png" sizes="32x32" />
      </head>
      <body
        className={`${inter.className} text-foreground flex min-h-dvh antialiased`}
      >
        {!user && <InvalidSessionModal open />}
        <Toaster duration={4000} richColors={true} />
        <SidebarProvider>
          {user && <Sidebar user={user} />}
          <div className="bg-background flex w-full flex-1">{children}</div>
        </SidebarProvider>
      </body>
    </html>
  );
}
