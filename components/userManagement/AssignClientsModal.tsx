import React, { useMemo, useState } from "react";
import ModalContainer from "../ui/ModalContainer";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import { CheckIcon, PlusIcon, XIcon } from "lucide-react";
import { UserType } from "@/types/user";
import { toggleAssignClientToFreelancer } from "@/actions/userActions";

export default function AssignClientsModal({
  open,
  closeModal,
  freelancer,
  clients,
  assignedClients,
  setAssignedClients,
}: {
  open: boolean;
  closeModal: () => void;
  freelancer: UserType;
  clients: UserType[];
  assignedClients: string[];
  setAssignedClients: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = useMemo(
    () =>
      clients.filter((client) => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return true;
        return (
          client.fullName.toLowerCase().includes(query) ||
          client.companyName.toLowerCase().includes(query) ||
          client.email.toLowerCase().includes(query) ||
          client.specialties.some((spe) => spe.toLowerCase().includes(query))
        );
      }),
    [clients, searchQuery],
  );

  async function toggleAssignClient(clientId: string) {
    if (assignedClients.includes(clientId)) {
      setAssignedClients((prev) => prev.filter((clId) => clId !== clientId));
    } else {
      setAssignedClients((prev) => [...prev, clientId]);
    }
    await toggleAssignClientToFreelancer(freelancer.id, clientId);
  }

  return (
    <ModalContainer open={open} closeModal={closeModal}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`flex w-[90%] max-w-[32rem] flex-col gap-4 rounded-md bg-white p-4 duration-200 sm:p-6 ${open ? "" : "scale-105"}`}
      >
        <div className="flex items-center justify-between">
          <h4 className="font-semibold sm:text-lg">
            Assign a freelancer to {freelancer.fullName}
          </h4>
          <button
            onClick={closeModal}
            className="p-1 text-gray-500 duration-200 hover:text-black"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search freelancers..."
          className="ring-accent-black/80 rounded-md border border-gray-300 p-2 text-sm ring-offset-2 duration-200 focus-visible:ring-2"
        />

        {filteredClients.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {filteredClients.map((client) => (
              <li key={client.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar user={client} className="h-10 w-10" />
                  <div className="">
                    <h3 className="text-sm font-medium">{client.fullName}</h3>
                    <p className="text-xs text-gray-500">
                      {client.specialties.join(", ")}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => toggleAssignClient(client.id)}
                  className={`${assignedClients.includes(client.id) ? "" : "hover:bg-accent text-accent border-accent border bg-white hover:text-white"}`}
                >
                  {assignedClients.includes(client.id) ? (
                    <>
                      <CheckIcon className="h-4 w-4" /> Assigned
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-4 w-4" /> Assign
                    </>
                  )}
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center py-8">
            <p className="text-center text-sm text-gray-500">
              No clients found
            </p>
          </div>
        )}
      </div>
    </ModalContainer>
  );
}
