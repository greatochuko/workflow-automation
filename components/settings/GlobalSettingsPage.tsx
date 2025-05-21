import React, { useState } from "react";
import { toast } from "sonner";
import VideoTypesManager from "./VideoTypesManager";
import {
  addToDefaultVideoTypes,
  updateDefaultVideoTypes,
} from "@/actions/videoTypeActions";

export default function GlobalSettingsPage({
  visible,
  videoTypes: initialVideoTypes,
}: {
  visible: boolean;
  videoTypes: string[];
}) {
  const [videoTypes, setVideoTypes] = useState(initialVideoTypes);

  if (!visible) return;

  async function handleAddVideoType(name: string) {
    const { error } = await addToDefaultVideoTypes(name);
    if (!error) {
      setVideoTypes((prev) =>
        [name, ...prev].sort((a, b) => a.localeCompare(b)),
      );
      return true;
    }
    return false;
  }

  async function handleUpdateVideoType(index: number, editValue: string) {
    const newVideoTypes = videoTypes.map((vidType, idx) =>
      idx === index ? editValue : vidType,
    );
    const { error } = await updateDefaultVideoTypes(newVideoTypes);
    if (!error) {
      setVideoTypes(newVideoTypes);
      return true;
    }
    return false;
  }

  async function handleDeleteVideoType(vidType: string) {
    const updatedVideoTypes = videoTypes.filter(
      (vt) => vt.toLowerCase() !== vidType,
    );
    setVideoTypes(updatedVideoTypes);
    toast.success("Video type deleted successfully");
    await updateDefaultVideoTypes(updatedVideoTypes);
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
