import React, { useState } from "react";
import { UserType } from "@/types/user";
import Select from "../ui/Select";
import KnowledgeBase from "./KnowledgeBase";
import VideoTypesManager from "./VideoTypesManager";
import { toast } from "sonner";
import {
  addVideoTypeToClient,
  updateClientVideoTypes,
} from "@/actions/videoTypeActions";
import { NewsletterTemplateSettings } from "./NewsletterTemplateSettings";
import ScriptSettings from "./ScriptSettings";
import YoutubeRepurposingSettings from "./YoutubeRepurposingSettings";
import ClientSOPSettings from "./ClientSOPSettings";

export default function ClientSettingsPage({
  clients,
  visible,
}: {
  clients: UserType[];
  visible: boolean;
}) {
  const [selectedClient, setSelectedClient] = useState<UserType | null>(null);

  if (!visible) return;

  async function handleAddVideoTypeToClient(name: string) {
    if (!selectedClient) return false;
    const { data } = await addVideoTypeToClient(selectedClient.id, name);
    if (data) {
      setSelectedClient({
        ...selectedClient,
        videoTypes: [name, ...selectedClient.videoTypes].sort((a, b) =>
          a.localeCompare(b),
        ),
      });
    }
    return !!data;
  }

  async function handleUpdateVideoType(index: number, editValue: string) {
    if (!selectedClient) return false;
    const newVideoTypes = selectedClient.videoTypes.map((vidType, idx) =>
      idx === index ? editValue : vidType,
    );
    const { data } = await updateClientVideoTypes(
      selectedClient.id,
      newVideoTypes,
    );
    if (data) {
      setSelectedClient({ ...selectedClient, videoTypes: newVideoTypes });
      return true;
    }
    return false;
  }

  async function handleDeleteVideoType(vidType: string) {
    if (!selectedClient) return;
    const updatedVideoTypes = selectedClient.videoTypes.filter(
      (vt) => vt.toLowerCase() !== vidType,
    );
    setSelectedClient({ ...selectedClient, videoTypes: updatedVideoTypes });
    toast.success("Video type deleted successfully");
    await updateClientVideoTypes(selectedClient.id, updatedVideoTypes);
  }

  function handleChangeSelectedClient(value: string) {
    const foundClient = clients.find((cl) => cl.id === value);
    if (!foundClient) setSelectedClient(null);
    else setSelectedClient(foundClient);
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4 rounded-md border border-gray-300 bg-white p-4 sm:gap-6 sm:p-6">
        <h2 className="text-lg font-semibold sm:text-xl lg:text-2xl">
          Select Client
        </h2>
        <Select
          value={selectedClient?.id || ""}
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

      {selectedClient && (
        <React.Fragment key={selectedClient.id}>
          <VideoTypesManager
            onAddVideoType={handleAddVideoTypeToClient}
            onDeleteVideoType={handleDeleteVideoType}
            onUpdateVideoType={handleUpdateVideoType}
            videoTypes={selectedClient.videoTypes}
            user={selectedClient}
          />
          <KnowledgeBase client={selectedClient} />
          <ScriptSettings client={selectedClient} />
          <NewsletterTemplateSettings client={selectedClient} />
          <YoutubeRepurposingSettings client={selectedClient} />
          <ClientSOPSettings client={selectedClient} />
        </React.Fragment>
      )}
    </>
  );
}
