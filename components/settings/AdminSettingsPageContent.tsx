"use client";

import React, { useState } from "react";
import GlobalSettingsPage from "./GlobalSettingsPage";
import ClientSettingsPage from "./ClientSettingsPage";
import { UserType } from "@/types/user";
import SharedDocumentsSettingsPage from "./SharedDocumentsSettingsPage";
import { SharedDocumentType } from "@/types/sharedDocument";

export default function AdminSettingsPageContent({
  videoTypes,
  clients,
  sharedDocuments,
}: {
  videoTypes: string[];
  clients: UserType[];
  sharedDocuments: SharedDocumentType[];
}) {
  const [tab, setTab] = useState<"global" | "client" | "docs">("client");

  return (
    <div className="mx-auto flex w-[90%] max-w-[min(1280px,_100vw)] flex-col gap-6 py-4">
      <div className="flex w-fit rounded-md bg-gray-100 p-1 text-sm font-medium">
        <button
          onClick={() => setTab("client")}
          className={`rounded-md px-3 py-1.5 duration-200 ${tab === "client" ? "bg-white shadow" : "text-gray-500"}`}
        >
          Client Settings
        </button>
        <button
          onClick={() => setTab("global")}
          className={`rounded-md px-3 py-1.5 duration-200 ${tab === "global" ? "bg-white shadow" : "text-gray-500"}`}
        >
          Global Settings
        </button>
        <button
          onClick={() => setTab("docs")}
          className={`rounded-md px-3 py-1.5 duration-200 ${tab === "docs" ? "bg-white shadow" : "text-gray-500"}`}
        >
          <span className="hidden min-[400px]:inline sm:hidden">Documents</span>
          <span className="min-[400px]:hidden">Docs</span>
          <span className="hidden sm:inline">Shared Documents</span>
        </button>
      </div>
      <GlobalSettingsPage videoTypes={videoTypes} visible={tab === "global"} />
      <ClientSettingsPage clients={clients} visible={tab === "client"} />
      <SharedDocumentsSettingsPage
        clients={clients}
        visible={tab === "docs"}
        sharedDocuments={sharedDocuments}
      />
    </div>
  );
}
