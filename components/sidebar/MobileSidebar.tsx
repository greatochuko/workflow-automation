"use client";

import { type UserType } from "@/types/user";
import {
  EditIcon,
  FileVideoIcon,
  HomeIcon,
  LogOutIcon,
  MailIcon,
  PanelLeftIcon,
  SettingsIcon,
  UserCogIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import Avatar from "../ui/Avatar";
import ModalContainer from "../ui/ModalContainer";
import useSidebarContext from "@/hooks/useSidebarContext";
import LogoutModal from "../auth/LogoutModal";

const sidebarLinks = [
  // { title: "Main", url: "/", icon: HomeIcon },
  { title: "Users", url: "/users", icon: UsersIcon },
  { title: "Settings", url: "/settings", icon: SettingsIcon },
];

export default function MobileSidebar({ user }: { user: UserType }) {
  const { sidebarOpen, setSidebarOpen } = useSidebarContext();

  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const mobileSidebarOpen = !sidebarOpen;

  const pathname = usePathname();

  function closeSidebar() {
    setSidebarOpen(true);
  }

  return (
    <>
      <ModalContainer
        open={mobileSidebarOpen}
        closeModal={() => setSidebarOpen(true)}
        className="md:hidden"
      >
        <aside
          onClick={(e) => e.stopPropagation()}
          className={`bg-accent-black-200 fixed top-0 left-0 flex h-dvh w-52 flex-col overflow-hidden text-sm text-white duration-200 ${mobileSidebarOpen ? "" : "-translate-x-full"}`}
        >
          <div className="flex items-center gap-2 p-4 font-semibold">
            <FileVideoIcon className="h-6 w-6" />
            <span>VidLeads</span>
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className={`ml-auto duration-200 ${!mobileSidebarOpen ? "text-accent-black-200 translate-x-10" : "text-gray-300 hover:text-white"}`}
            >
              <PanelLeftIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-col gap-2 p-2">
            <h3 className="px-2 text-gray-400">Navigation</h3>
            <nav>
              <ul className="flex flex-col gap-2">
                {user.role !== "ADMIN" && (
                  <li onClick={closeSidebar}>
                    <Link
                      href={"/"}
                      className={`flex items-center gap-4 rounded-md p-2 ${
                        pathname === "/"
                          ? "text-accent-black-200 bg-white font-semibold"
                          : "font-medium hover:bg-white/10"
                      }`}
                    >
                      <HomeIcon className="h-4 w-4" />
                      Main
                    </Link>
                  </li>
                )}

                {user.role === "CLIENT" && (
                  <>
                    <li>
                      <Link
                        href={"/newsletter-content"}
                        className={`flex items-center gap-4 rounded-md p-2 ${
                          pathname === "/newsletter-content"
                            ? "text-accent-black-200 bg-white font-semibold"
                            : "font-medium hover:bg-white/10"
                        }`}
                      >
                        <MailIcon className="h-4 w-4" />
                        Newsletter Content
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={"/script-generator"}
                        className={`flex items-center gap-4 rounded-md p-2 ${
                          pathname === "/script-generator"
                            ? "text-accent-black-200 bg-white font-semibold"
                            : "font-medium hover:bg-white/10"
                        }`}
                      >
                        <EditIcon className="h-4 w-4" />
                        Script Generator
                      </Link>
                    </li>
                  </>
                )}

                {sidebarLinks.map((link) => (
                  <li
                    onClick={closeSidebar}
                    key={link.title}
                    hidden={user.role !== "ADMIN"}
                  >
                    <Link
                      href={link.url}
                      className={`flex items-center gap-4 rounded-md p-2 ${
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
                onClick={() => {
                  closeSidebar();
                  setLogoutModalOpen(true);
                }}
                className="flex items-center justify-center gap-1 rounded-md bg-white/[.02] px-3 py-1.5 text-xs duration-200 hover:bg-white/10"
              >
                <LogOutIcon className="h-3 w-3" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>
      </ModalContainer>
      <LogoutModal
        open={logoutModalOpen}
        closeModal={() => setLogoutModalOpen(false)}
      />
    </>
  );
}
