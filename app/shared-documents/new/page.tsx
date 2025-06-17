import SharedDocumentForm from "@/components/shared-document/SharedDocumentForm";
import ToggleSidebarButton from "@/components/sidebar/ToggleSidebarButton";
import { getSession } from "@/services/authServices";
import { notFound } from "next/navigation";
import React from "react";

export default async function page() {
  const { data: user } = await getSession();

  if (user?.role !== "CLIENT") notFound();

  return (
    <main className="flex w-full flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-[5%] py-4">
        <div className="flex flex-col">
          <h1 className="flex items-center text-lg font-bold capitalize sm:text-xl md:text-2xl xl:text-[28px]">
            <ToggleSidebarButton />
            Create Shared Document
          </h1>
          <p className="text-sm text-gray-500">
            Easily create and manage documents to collaborate with your team in
            real time.
          </p>
        </div>
      </div>
      <div className="mx-auto flex w-[90%] max-w-7xl flex-1 py-4">
        <SharedDocumentForm />
      </div>
    </main>
  );
}
