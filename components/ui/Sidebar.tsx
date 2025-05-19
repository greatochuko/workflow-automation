"use client";

import { User } from "@prisma/client";
import {
  FileVideoIcon,
  HomeIcon,
  PanelLeftIcon,
  SettingsIcon,
  UserCogIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import Avatar from "./Avatar";
import LogoutButton from "../auth/LogoutButton";

const sidebarLinks = [
  { title: "Main", url: "/", icon: HomeIcon },
  { title: "Users", url: "/users", icon: UsersIcon },
  { title: "Settings", url: "/settings", icon: SettingsIcon },
];

export default function Sidebar({ user }: { user: User }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  if (pathname.startsWith("/login")) return null;

  return (
    <>
      <aside
        className={`bg-accent-black-200 sticky top-0 flex h-dvh flex-col overflow-hidden text-sm text-white duration-200 ${sidebarOpen ? "w-50" : "w-0"}`}
      >
        <div className="flex items-center gap-2 p-4 font-semibold">
          <FileVideoIcon className="h-6 w-6" />
          <span>VideoFlow</span>
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className={`ml-auto duration-200 ${!sidebarOpen ? "text-accent-black-200 translate-x-10" : "text-gray-300 hover:text-white"}`}
          >
            <PanelLeftIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-2 p-2">
          <h3 className="px-2 text-gray-400">Navigation</h3>
          <nav>
            <ul className="flex flex-col gap-2">
              {sidebarLinks.map((link) => (
                <li
                  key={link.title}
                  hidden={
                    (link.title === "Settings" || link.title === "Users") &&
                    user.role !== "ADMIN"
                  }
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

            <LogoutButton />
          </div>
        </div>
      </aside>
    </>
  );
}
