"use client";

import React, { useMemo, useState } from "react";
import { PencilIcon } from "lucide-react";
import { User } from "@prisma/client";
import Avatar from "../ui/Avatar";
import CreateUserButton from "./CreateUserButton";

export default function UserManagementPageContent({
  users,
}: {
  users: User[];
}) {
  const [tab, setTab] = useState<"client" | "freelancer">("client");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = useMemo(
    () => users.filter((user) => user.role.toLowerCase() === tab),
    [tab, users],
  );

  const clientUsers = useMemo(
    () => users.filter((user) => user.role === "CLIENT"),
    [users],
  );

  const freelanceUsers = useMemo(
    () => users.filter((user) => user.role === "FREELANCER"),
    [users],
  );

  const searchedUsers = useMemo(
    () =>
      filteredUsers.filter((user) => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return true;
        return (
          user.fullName.toLowerCase().includes(query) ||
          user.companyName.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
        );
      }),
    [filteredUsers, searchQuery],
  );

  return (
    <div className="mx-auto flex w-[90%] max-w-7xl flex-col gap-6 py-4">
      <div className="flex justify-between">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users..."
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm"
        />
        <CreateUserButton />
      </div>
      <div className="flex w-fit rounded-md bg-gray-100 p-1 text-sm font-medium">
        <button
          onClick={() => setTab("client")}
          className={`rounded-md px-3 py-1.5 duration-200 ${tab === "client" ? "bg-white shadow" : "text-gray-500"}`}
        >
          Clients ({clientUsers.length})
        </button>
        <button
          onClick={() => setTab("freelancer")}
          className={`rounded-md px-3 py-1.5 duration-200 ${tab === "freelancer" ? "bg-white shadow" : "text-gray-500"}`}
        >
          Freelancers ({freelanceUsers.length})
        </button>
      </div>
      <div className="flex flex-col gap-4 rounded-md border border-gray-200 bg-white p-4 sm:p-6">
        <h2 className="text-xl font-semibold capitalize md:text-2xl">
          {tab + "s"}
        </h2>
        {searchedUsers.length > 0 ? (
          <ul className="flex flex-col">
            {searchedUsers.map((user) => (
              <li
                className="flex items-center justify-between gap-4 border-b border-gray-200 py-4 last:border-b-0"
                key={user.id}
              >
                <div className="flex items-center gap-3">
                  <Avatar user={user as User} className="h-10 w-10" />
                  <div className="">
                    <h3 className="font-medium">{user.fullName}</h3>
                    <p className="text-sm text-gray-500">
                      {user.role === "FREELANCER"
                        ? user.specialties.join(", ")
                        : user.companyName}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                {user.role === "FREELANCER" ? (
                  <div className="flex items-center gap-4">
                    <p className="ml-auto text-sm">1 Client</p>
                    <button className="rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm font-medium duration-200 hover:bg-gray-100">
                      Assign to
                    </button>
                    <button className="hover:bg-accent rounded-md p-2 duration-200 hover:text-white">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <p className="ml-auto text-sm">1 Freelancer</p>
                    <button className="rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm font-medium duration-200 hover:bg-gray-100">
                      Assign
                    </button>
                    <button className="hover:bg-accent rounded-md p-2 duration-200 hover:text-white">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center py-8">
            <p className="text-center text-gray-500">No {tab}s found</p>
          </div>
        )}
      </div>
    </div>
  );
}
