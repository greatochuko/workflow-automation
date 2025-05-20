import React, { useState } from "react";
import Button from "../ui/Button";
import {
  CheckIcon,
  EditIcon,
  LoaderIcon,
  PlusIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import {
  createVideoType,
  deleteVideoType,
  updateVideoType,
} from "@/actions/videoTypeActions";
import { VideoType } from "@prisma/client";

export default function GlobalSettingsPage({
  videoTypes: initialVideoTypes,
}: {
  videoTypes: VideoType[];
}) {
  const [videoTypes, setVideoTypes] = useState(initialVideoTypes);
  const [videoTypeInput, setVideoTypeInput] = useState("");
  const [editValue, setEditValue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  async function handleAddVideoType(e: React.FormEvent) {
    e.preventDefault();
    if (!videoTypeInput.trim()) return;
    setCreating(true);
    const { data } = await createVideoType(videoTypeInput);
    if (data) {
      setVideoTypes((prev) => [...prev, data]);
      setVideoTypeInput("");
    }
    setCreating(false);
  }

  const handleStartEdit = (id: string) => {
    const typeToEdit = videoTypes.find((vidType) => vidType.id === id);
    if (typeToEdit) {
      setEditingId(id);
      setEditValue(typeToEdit.name);
    }
  };

  function handleCancelEdit() {
    setEditingId(null);
    setEditValue("");
  }

  async function handleSaveEdit() {
    if (!editValue.trim()) return;
    if (editingId !== null) {
      setUpdating(true);
      const { data } = await updateVideoType(editingId, editValue);

      if (data) {
        setVideoTypes((prev) =>
          prev.map((vidType) => (vidType.id === editingId ? data : vidType)),
        );
        setEditingId(null);
      }
      setUpdating(false);
    }
  }

  async function handleDeleteVideoType(id: string) {
    setVideoTypes((prev) => prev.filter((vidType) => vidType.id !== id));
    await deleteVideoType(id);
  }

  return (
    <div className="flex flex-col gap-4 rounded-md border border-gray-300 bg-white p-4 sm:gap-6 sm:p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold sm:text-xl lg:text-2xl">
          Manage Video Types
        </h2>
        <p className="text-sm text-gray-500">
          Add, edit, or remove video types available to clients when uploading
          videos
        </p>
      </div>

      <form
        onSubmit={handleAddVideoType}
        className="mb-4 flex items-center space-x-2"
      >
        <input
          placeholder="Add new video type"
          value={videoTypeInput}
          onChange={(e) => setVideoTypeInput(e.target.value)}
          disabled={creating}
          className="bg-background flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm"
        />
        <Button type="submit" disabled={creating} onClick={handleAddVideoType}>
          {creating ? (
            <>
              <LoaderIcon className="h-4 w-4 animate-spin" /> Adding...
            </>
          ) : (
            <>
              <PlusIcon className="h-4 w-4" /> Add
            </>
          )}
        </Button>
      </form>

      <div className="overflow-hidden rounded-lg border border-gray-300">
        <div className="border-b border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium">
          Available Video Types
        </div>
        <ul className="divide-y divide-gray-300">
          {videoTypes.map((vidType, index) => (
            <li
              key={`${vidType}-${index}`}
              className="flex items-center justify-between px-4 py-2"
            >
              {editingId === vidType.id ? (
                <div className="flex flex-1 items-center space-x-2">
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="bg-background flex-1 rounded-md border border-gray-300 px-4 py-2 disabled:opacity-50"
                    disabled={updating}
                    autoFocus
                  />
                  <button
                    onClick={handleSaveEdit}
                    disabled={updating}
                    className={`rounded-md p-3 duration-200 hover:bg-gray-100 ${updating ? "bg-gray-100" : ""}`}
                  >
                    {updating ? (
                      <LoaderIcon className="h-4 w-4 animate-spin text-gray-500" />
                    ) : (
                      <CheckIcon className="h-4 w-4 text-green-500" />
                    )}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="rounded-md p-3 duration-200 hover:bg-gray-100"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <span className="flex-1">{vidType.name}</span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleStartEdit(vidType.id)}
                      className="rounded-md p-3 duration-200 hover:bg-gray-100"
                    >
                      <EditIcon className="h-4 w-4 text-blue-500" />
                    </button>
                    <button
                      onClick={() => handleDeleteVideoType(vidType.id)}
                      className="rounded-md p-3 duration-200 hover:bg-gray-100"
                    >
                      <Trash2Icon className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
          {videoTypes.length === 0 && (
            <li className="px-4 py-6 text-center text-gray-500">
              No video types available. Add one above.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
