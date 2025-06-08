"use client";

import React, { useState } from "react";
import GlobalSettingsPage from "./GlobalSettingsPage";
import ClientSettingsPage from "./ClientSettingsPage";
import { UserType } from "@/types/user";

export default function AdminSettingsPageContent({
  videoTypes,
  clients,
}: {
  videoTypes: string[];
  clients: UserType[];
}) {
  const [tab, setTab] = useState<"global" | "client">("client");

  return (
    <div className="mx-auto flex w-[90%] max-w-7xl flex-col gap-6 py-4">
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
      </div>
      <GlobalSettingsPage videoTypes={videoTypes} visible={tab === "global"} />
      <ClientSettingsPage clients={clients} visible={tab === "client"} />
    </div>
  );
}
