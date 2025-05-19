"use client";

import React from "react";
import { LogOutIcon } from "lucide-react";

export default function LogoutButton() {
  function handleLogout() {}

  return (
    <button
      onClick={handleLogout}
      className="flex items-center justify-center gap-1 rounded-md bg-white/[.02] px-3 py-1.5 text-xs duration-200 hover:bg-white/10"
    >
      <LogOutIcon className="h-3 w-3" />
      <span>Logout</span>
    </button>
  );
}
