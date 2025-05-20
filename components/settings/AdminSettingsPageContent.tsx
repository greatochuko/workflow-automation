"use client";

import React, { useState } from "react";
import GlobalSettingsPage from "./GlobalSettingsPage";
import { VideoType } from "@prisma/client";

export default function AdminSettingsPageContent({
  videoTypes,
}: {
  videoTypes: VideoType[];
}) {
  const [tab, setTab] = useState<"global" | "client">("global");

  return (
    <div className="mx-auto flex w-[90%] max-w-7xl flex-col gap-6 py-4">
      <div className="flex w-fit rounded-md bg-gray-100 p-1 text-sm font-medium">
        <button
          onClick={() => setTab("global")}
          className={`rounded-md px-3 py-1.5 duration-200 ${tab === "global" ? "bg-white shadow" : "text-gray-500"}`}
        >
          Global Settings
        </button>
        <button
          onClick={() => setTab("client")}
          className={`rounded-md px-3 py-1.5 duration-200 ${tab === "client" ? "bg-white shadow" : "text-gray-500"}`}
        >
          Client Settings
        </button>
      </div>
      {tab === "global" ? (
        <GlobalSettingsPage videoTypes={videoTypes} />
      ) : (
        <GlobalSettingsPage videoTypes={videoTypes} />
      )}
    </div>
  );
}
