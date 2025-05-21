import React, { useState } from "react";
import {
  createVideoType,
  deleteVideoType,
  updateVideoType,
} from "@/actions/videoTypeActions";
import { VideoType } from "@prisma/client";
import { toast } from "sonner";
import VideoTypesManager from "./VideoTypesManager";

export default function GlobalSettingsPage({
  visible,
  videoTypes: initialVideoTypes,
}: {
  visible: boolean;
  videoTypes: VideoType[];
}) {
  const [videoTypes, setVideoTypes] = useState(initialVideoTypes);

  if (!visible) return;

  async function handleAddVideoType(name: string) {
    const { data } = await createVideoType(name);
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

  return (
    <VideoTypesManager
      videoTypes={videoTypes}
      onAddVideoType={handleAddVideoType}
      onUpdateVideoType={handleUpdateVideoType}
      onDeleteVideoType={handleDeleteVideoType}
    />
  );
}
