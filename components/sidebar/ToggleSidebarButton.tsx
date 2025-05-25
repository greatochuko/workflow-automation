"use client";

import useSidebarContext from "@/hooks/useSidebarContext";
import { PanelLeftIcon } from "lucide-react";
import React from "react";

export default function ToggleSidebarButton() {
  const { sidebarOpen, setSidebarOpen } = useSidebarContext();

  return (
    <button
      onClick={() => setSidebarOpen((prev) => !prev)}
      className={`mr-2 ${sidebarOpen ? "sm:hidden" : "block"}`}
    >
      <PanelLeftIcon className="h-5 w-5" />
    </button>
  );
}
