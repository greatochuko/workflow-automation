"use client";

import React, { useState } from "react";
import { LogOutIcon } from "lucide-react";
import LogoutModal from "./LogoutModal";

export default function LogoutButton() {
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setLogoutModalOpen(true)}
        className="flex items-center justify-center gap-1 rounded-md bg-white/[.02] px-3 py-1.5 text-xs duration-200 hover:bg-white/10"
      >
        <LogOutIcon className="h-3 w-3" />
        <span>Logout</span>
      </button>

      <LogoutModal
        open={logoutModalOpen}
        closeModal={() => setLogoutModalOpen(false)}
      />
    </>
  );
}
