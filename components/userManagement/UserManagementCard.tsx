"use client";

import { PencilIcon } from "lucide-react";
import React, { useState } from "react";
import Avatar from "../ui/Avatar";
import { type UserType } from "@/types/user";
import AssignFreelancersModal from "./AssignFreelancersModal";

export default function UserManagementCard({
  user,
  freelancers,
}: {
  user: UserType;
  freelancers: UserType[];
}) {
  const [assignModalIsOpen, setAssignModalIsOpen] = useState(false);

  return (
    <>
      <li
        className="flex items-center justify-between gap-4 border-b border-gray-200 py-4 last:border-b-0"
        key={user.id}
      >
        <div className="flex items-center gap-3">
          <Avatar user={user} className="h-10 w-10" />
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
            <button
              onClick={() => setAssignModalIsOpen(true)}
              className="rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm font-medium duration-200 hover:bg-gray-100"
            >
              Assign
            </button>
            <button className="hover:bg-accent rounded-md p-2 duration-200 hover:text-white">
              <PencilIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </li>
      <AssignFreelancersModal
        open={assignModalIsOpen}
        closeModal={() => setAssignModalIsOpen(false)}
        client={user}
        freelancers={freelancers}
      />
    </>
  );
}
