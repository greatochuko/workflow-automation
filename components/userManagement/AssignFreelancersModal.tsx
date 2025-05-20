import React, { useMemo, useState } from "react";
import ModalContainer from "../ui/ModalContainer";
import Avatar from "../ui/Avatar";
import CustomButton from "../ui/CustomButton";
import { CheckIcon, PlusIcon } from "lucide-react";
import { UserType } from "@/types/user";
import { assignFreelancerToClient } from "@/actions/userActions";

export default function AssignFreelancersModal({
  open,
  closeModal,
  client,
  freelancers,
}: {
  open: boolean;
  closeModal: () => void;
  client: UserType;
  freelancers: UserType[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [assignedFreelancers, setAssignedFreelancers] = useState(
    client.assignedFreelancers,
  );

  const filteredFreelancers = useMemo(
    () =>
      freelancers.filter((freelanceUser) => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return true;
        return (
          freelanceUser.fullName.toLowerCase().includes(query) ||
          freelanceUser.companyName.toLowerCase().includes(query) ||
          freelanceUser.email.toLowerCase().includes(query) ||
          freelanceUser.specialties.some((spe) =>
            spe.toLowerCase().includes(query),
          )
        );
      }),
    [freelancers, searchQuery],
  );

  async function toggleAssignFreelancer(user: UserType) {
    if (assignedFreelancers.some((u) => u.id === u.id)) {
      setAssignedFreelancers([]);
      await assignFreelancerToClient(client.id, null);
    } else {
      setAssignedFreelancers([user]);
      await assignFreelancerToClient(client.id, user);
    }
  }

  return (
    <ModalContainer open={open} closeModal={closeModal}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`flex w-[90%] max-w-[32rem] flex-col gap-4 rounded-md bg-white p-4 duration-200 sm:p-6 ${open ? "" : "scale-105"}`}
      >
        <h4 className="font-semibold sm:text-lg">
          Assign a freelancer to {client.fullName}
        </h4>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search freelancers..."
          className="ring-accent-black/80 rounded-md border border-gray-300 p-2 text-sm ring-offset-2 duration-200 focus-visible:ring-2"
        />

        {filteredFreelancers.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {filteredFreelancers.map((freelancer) => (
              <li
                key={freelancer.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Avatar user={freelancer} className="h-10 w-10" />
                  <div className="">
                    <h3 className="text-sm font-medium">
                      {freelancer.fullName}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {freelancer.specialties.join(", ")}
                    </p>
                  </div>
                </div>
                <CustomButton
                  onClick={() => toggleAssignFreelancer(freelancer)}
                  className={`${assignedFreelancers.some((user) => user.id === freelancer.id) ? "" : "hover:bg-accent text-accent border-accent border bg-white hover:text-white"}`}
                >
                  {assignedFreelancers.some(
                    (user) => user.id === freelancer.id,
                  ) ? (
                    <>
                      <CheckIcon className="h-4 w-4" /> Assigned
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-4 w-4" /> Assign
                    </>
                  )}
                </CustomButton>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center py-8">
            <p className="text-center text-sm text-gray-500">
              No freelancers found
            </p>
          </div>
        )}
      </div>
    </ModalContainer>
  );
}
