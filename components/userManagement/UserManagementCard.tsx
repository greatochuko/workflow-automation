"use client";

import { TrashIcon } from "lucide-react";
import React, { useState } from "react";
import Avatar from "../ui/Avatar";
import { type UserType } from "@/types/user";
import AssignClientsModal from "./AssignClientsModal";
import { toggleAssignFreelancerToClient } from "@/actions/userActions";
import Select from "../ui/Select";
import DeleteUserModal from "./DeleteUserModal";

export default function UserManagementCard({
  user,
  freelancers,
  clients,
  removeFromUserList,
}: {
  user: UserType;
  freelancers: UserType[];
  clients: UserType[];
  removeFromUserList(deletedUserId: string): void;
}) {
  const [assignedFreelancers, setAssignedFreelancers] = useState(
    user.assignedFreelancers.map((freelancer) => freelancer.id),
  );
  const [assignModalIsOpen, setAssignModalIsOpen] = useState(false);
  const [deleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
  const [assignedClients, setAssignedClients] = useState(
    user.assignedClients.map((client) => client.id),
  );

  async function handleAssignFreelancer(freelancerId: string) {
    if (assignedFreelancers.includes(freelancerId)) return;

    if (!freelancerId) {
      setAssignedFreelancers([]);
    } else {
      setAssignedFreelancers((prev) => [...prev, freelancerId]);
    }
    await toggleAssignFreelancerToClient(user.id, freelancerId);
  }

  return (
    <li
      className="flex flex-col flex-wrap justify-between gap-4 border-b border-gray-200 py-4 last:border-b-0 sm:flex-row sm:items-center"
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
          <p className="text-sm sm:ml-auto">
            {assignedClients.length} Client
            {assignedClients.length === 1 ? "" : "s"}
          </p>
          <button
            onClick={() => setAssignModalIsOpen(true)}
            className="flex-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm font-medium duration-200 hover:bg-gray-100 sm:flex-none"
          >
            Assign to
          </button>
          <button
            onClick={() => setDeleteUserModalOpen(true)}
            className="hover:bg-accent-red text-accent-red rounded-md p-2 duration-200 hover:text-white"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-4">
          <p className="text-sm sm:ml-auto">
            {assignedFreelancers.length} Freelancer
            {assignedFreelancers.length === 1 ? "" : "s"}
          </p>
          <div className="flex items-center gap-4">
            <Select
              value={assignedFreelancers[0] || ""}
              onChange={(value) => handleAssignFreelancer(value)}
              containerClassName="w-40 flex-1 sm:flex-none"
              options={[
                { id: "", fullName: "Select a freelancer" },
                ...freelancers,
              ].map((freelancer) => ({
                value: freelancer.id,

                label: (
                  <div
                    key={freelancer.id}
                    // className="whitespace-nowrap "
                  >
                    {freelancer.fullName}
                  </div>
                ),
              }))}
            />

            <button
              onClick={() => setDeleteUserModalOpen(true)}
              className="hover:bg-accent-red text-accent-red rounded-md p-2 duration-200 hover:text-white"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {user.role === "FREELANCER" && (
        <AssignClientsModal
          open={assignModalIsOpen}
          closeModal={() => setAssignModalIsOpen(false)}
          freelancer={user}
          clients={clients}
          assignedClients={assignedClients}
          setAssignedClients={setAssignedClients}
        />
      )}

      <DeleteUserModal
        open={deleteUserModalOpen}
        closeModal={() => setDeleteUserModalOpen(false)}
        userId={user.id}
        userName={user.fullName}
        removeFromUserList={removeFromUserList}
      />
    </li>
  );
}
