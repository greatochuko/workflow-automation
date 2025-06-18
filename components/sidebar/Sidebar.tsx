"use client";

import { type UserType } from "@/types/user";
import {
  FileTextIcon,
  FileVideoIcon,
  HomeIcon,
  LogOutIcon,
  PanelLeftIcon,
  UserCogIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import Avatar from "../ui/Avatar";
import useSidebarContext from "@/hooks/useSidebarContext";
import LogoutModal from "../auth/LogoutModal";
import { sidebarLinks, noSidebarRoutes } from "@/lib/data/constants";
import { SharedDocumentType } from "@/types/sharedDocument";

export default function Sidebar({
  user,
  sharedDocuments,
}: {
  user: UserType;
  sharedDocuments: SharedDocumentType[];
}) {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useSidebarContext();

  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  if (noSidebarRoutes.some((route) => pathname.startsWith(route))) return null;

  return (
    <>
      <aside
        className={`bg-accent-black-200 sticky top-0 hidden h-dvh flex-col overflow-hidden text-sm text-white duration-200 md:flex ${sidebarOpen ? "w-56" : "w-0"}`}
      >
        <div className="flex items-center gap-2 p-4 font-semibold">
          <FileVideoIcon className="h-6 w-6" />
          <span className="whitespace-nowrap">Clinic Lead Stack</span>
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className={`ml-auto duration-200 ${!sidebarOpen ? "text-accent-black-200 translate-x-10" : "text-gray-300 hover:text-white"}`}
          >
            <PanelLeftIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-2 p-2">
          <h3 className="px-2 text-xs text-gray-400">Navigation</h3>
          <nav>
            <ul className="flex flex-col gap-2">
              <li hidden={user.role === "ADMIN"}>
                <Link
                  href={"/"}
                  className={`flex items-center gap-3 rounded-md p-2 ${
                    pathname === "/"
                      ? "text-accent-black-200 bg-white font-semibold"
                      : "font-medium hover:bg-white/10"
                  }`}
                >
                  <HomeIcon className="h-4 w-4" />
                  Main
                </Link>
              </li>

              {sidebarLinks.map((link) => (
                <li key={link.title} hidden={user.role !== link.validUserRole}>
                  <Link
                    href={link.url}
                    className={`flex items-center gap-3 rounded-md p-2 whitespace-nowrap ${
                      pathname.startsWith(link.url)
                        ? "text-accent-black-200 bg-white font-semibold"
                        : "font-medium hover:bg-white/10"
                    }`}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.title}
                  </Link>
                </li>
              ))}

              {user.role !== "ADMIN" && (
                <div className="mt-4 flex flex-col gap-2">
                  <h4 className="px-2 text-xs font-medium text-gray-400">
                    Shared Documents
                  </h4>
                  {sharedDocuments.map((doc) => (
                    <li key={doc.id} hidden={user.role === "ADMIN"}>
                      <Link
                        href={`/shared-documents/${doc.id}`}
                        className={`flex items-center gap-3 rounded-md p-2 whitespace-nowrap ${
                          pathname.startsWith(`/shared-documents/${doc.id}`)
                            ? "text-accent-black-200 bg-white font-semibold"
                            : "font-medium hover:bg-white/10"
                        }`}
                      >
                        <FileTextIcon className="h-4 w-4" />
                        <span className="flex-1 overflow-hidden overflow-ellipsis">
                          {doc.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </div>
              )}
            </ul>
          </nav>
        </div>

        <div className="mt-auto flex flex-col gap-2 border-t border-gray-700 p-4">
          <div className="flex items-center gap-2 pb-2">
            <Avatar user={user} className="h-8 w-8" />
            <div>
              <p className="text-sm font-medium">{user.fullName}</p>
              <p className="text-xs text-gray-400 capitalize">
                {user.role.toLowerCase()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={"/profile"}
              className="flex items-center justify-center gap-1 rounded-md bg-white/[.02] px-3 py-1.5 text-xs duration-200 hover:bg-white/10"
            >
              <UserCogIcon className="h-3 w-3" />
              <span>Profile</span>
            </Link>

            <button
              onClick={() => setLogoutModalOpen(true)}
              className="flex items-center justify-center gap-1 rounded-md bg-white/[.02] px-3 py-1.5 text-xs duration-200 hover:bg-white/10"
            >
              <LogOutIcon className="h-3 w-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
      <LogoutModal
        open={logoutModalOpen}
        closeModal={() => setLogoutModalOpen(false)}
      />
    </>
  );
}
