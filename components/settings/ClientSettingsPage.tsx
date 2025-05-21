import React, { useMemo, useState } from "react";
import { UserType } from "@/types/user";
import Select from "../ui/Select";
import KnowledgeBase from "./KnowledgeBase";

export default function ClientSettingsPage({
  clients,
  visible,
}: {
  clients: UserType[];
  visible: boolean;
}) {
  const [selectedClientId, setSelectedClientId] = useState("");

  const selectedClient = useMemo(
    () => clients.find((cl) => cl.id === selectedClientId),
    [clients, selectedClientId],
  );

  if (!visible) return;

  return (
    <>
      <div className="flex flex-col gap-4 rounded-md border border-gray-300 bg-white p-4 sm:gap-6 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold sm:text-xl lg:text-2xl">
            Select Client
          </h2>
          <Select
            value={selectedClientId}
            onChange={(value) => setSelectedClientId(value)}
            containerClassName="w-40"
            options={[{ id: "", fullName: "Select a client" }, ...clients].map(
              (client) => ({
                value: client.id,
                label: (
                  <div
                    key={client.id}
                    // className="whitespace-nowrap "
                  >
                    {client.fullName}
                  </div>
                ),
              }),
            )}
          />
        </div>
      </div>

      {selectedClient && <KnowledgeBase client={selectedClient} />}
    </>
  );
}
