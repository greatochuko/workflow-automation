"use client";

import useSidebarContext from "@/hooks/useSidebarContext";
import { PanelLeftIcon } from "lucide-react";
import React from "react";

export default function ToggleSidebarButton() {
  const { sidebarOpen, setSidebarOpen } = useSidebarContext();

  if (sidebarOpen) return null;

  return (
    <button onClick={() => setSidebarOpen((prev) => !prev)} className={`mr-2`}>
      <PanelLeftIcon className="h-5 w-5" />
    </button>
  );
}
