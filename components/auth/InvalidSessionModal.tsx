"use client";

import React, { useState } from "react";
import ModalContainer from "../ui/ModalContainer";
import { LoaderIcon, LogOutIcon } from "lucide-react";
import Button from "../ui/Button";
import { logoutUser } from "@/actions/authActions";
import { usePathname } from "next/navigation";

const noModalRoutes = [
  "/login",
  "/change-password",
  "/privacy-policy",
  "/terms-of-service",
];

export default function InvalidSessionModal({ open }: { open: boolean }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  if (noModalRoutes.some((route) => pathname.startsWith(route))) return null;

  async function handleLogout() {
    setLoading(true);
    await logoutUser();
    setLoading(false);
  }

  return (
    <ModalContainer open={open} closeModal={() => {}}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`text-accent-black flex w-[90%] max-w-sm flex-col items-center gap-2 rounded-lg bg-white p-4 px-6 text-center shadow duration-200 ${open ? "" : "scale-105"}`}
      >
        <span className="bg-accent-black rounded-full p-3 text-white">
          <LogOutIcon className="h-5 w-5" />
        </span>

        <h2 className="mb-2 text-lg font-semibold">Invalid Session</h2>
        <p className="mb-4 text-sm text-gray-700">
          Your session is no longer valid. Please log out and sign in again.
        </p>
        <div className="flex w-full flex-col gap-4">
          <Button
            disabled={loading}
            className="rounded-full py-4"
            onClick={handleLogout}
          >
            {loading ? (
              <>
                <LoaderIcon className="h-4 w-4 animate-spin" /> Logging out...
              </>
            ) : (
              "Log in again"
            )}
          </Button>
        </div>
      </div>
    </ModalContainer>
  );
}
