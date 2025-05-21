import React, { useMemo, useState } from "react";
import { UserType } from "@/types/user";
import Select from "../ui/Select";
import KnowledgeBase from "./KnowledgeBase";
import VideoTypesManager from "./VideoTypesManager";
import {
  addVideoTypeToClient,
  deleteVideoType,
  updateVideoType,
} from "@/actions/videoTypeActions";
import { VideoType } from "@prisma/client";
import { toast } from "sonner";

export default function ClientSettingsPage({
  clients,
  visible,
}: {
  clients: UserType[];
  visible: boolean;
}) {
  const [selectedClientId, setSelectedClientId] = useState("");
  const [videoTypes, setVideoTypes] = useState<VideoType[]>([]);

  const selectedClient = useMemo(
    () => clients.find((cl) => cl.id === selectedClientId),
    [clients, selectedClientId],
  );

  if (!visible) return;

  async function handleAddVideoTypeToClient(name: string) {
    if (!selectedClient) return false;
    const { data } = await addVideoTypeToClient(selectedClient.id, name);
    if (data) {
      setVideoTypes((prev) => [data, ...prev]);
    }
    return !!data;
  }

  async function handleUpdateVideoType(editingId: string, editValue: string) {
    const { data } = await updateVideoType(editingId, editValue);
    if (data) {
      setVideoTypes((prev) =>
        prev.map((vidType) => (vidType.id === editingId ? data : vidType)),
      );
    }
    return data;
  }

  async function handleDeleteVideoType(id: string) {
    setVideoTypes((prev) => prev.filter((vidType) => vidType.id !== id));
    toast.success("Video type deleted successfully");
    await deleteVideoType(id);
  }

  function handleChangeSelectedClient(value: string) {
    setSelectedClientId(value);
    const foundClient = clients.find((cl) => cl.id === value);
    if (!foundClient) return;
    setVideoTypes(foundClient.videoTypes);
  }

  return (
    <>
      <div className="flex flex-col gap-4 rounded-md border border-gray-300 bg-white p-4 sm:gap-6 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold sm:text-xl lg:text-2xl">
            Select Client
          </h2>
          <Select
            value={selectedClientId}
            onChange={handleChangeSelectedClient}
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

      {selectedClient && (
        <>
          <VideoTypesManager
            onAddVideoType={handleAddVideoTypeToClient}
            onDeleteVideoType={handleDeleteVideoType}
            onUpdateVideoType={handleUpdateVideoType}
            videoTypes={videoTypes}
            user={selectedClient}
          />
          <KnowledgeBase client={selectedClient} />
        </>
      )}
    </>
  );
}
