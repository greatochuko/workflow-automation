import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar/Sidebar";
import { getSession } from "@/services/authServices";
import SidebarProvider from "@/context/SidebarContext";
import { Toaster } from "sonner";
import InvalidSessionModal from "@/components/auth/InvalidSessionModal";
import MobileSidebar from "@/components/sidebar/MobileSidebar";
import { getSharedDocuments } from "@/services/sharedDocumentServices";
import { SharedDocumentType } from "@/types/sharedDocument";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clinic Lead Stack",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: user } = await getSession();
  let sharedDocuments: SharedDocumentType[] = [];
  if (user?.role === "CLIENT" || user?.role === "FREELANCER") {
    const { data } = await getSharedDocuments();
    sharedDocuments = data;
  }

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width" />
        <link rel="icon" href="/favicon-2.svg" type="image/png" sizes="32x32" />
      </head>
      <body
        className={`${inter.className} text-foreground flex min-h-dvh antialiased`}
      >
        {!user && <InvalidSessionModal open />}
        <Toaster duration={4000} richColors={true} />
        <SidebarProvider>
          {user && (
            <>
              <MobileSidebar user={user} sharedDocuments={sharedDocuments} />
              <Sidebar user={user} sharedDocuments={sharedDocuments} />
            </>
          )}
          <div className="bg-background flex w-full flex-1">{children}</div>
        </SidebarProvider>
      </body>
    </html>
  );
}
