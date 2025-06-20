import { SOPSettingType, UserType } from "@/types/user";
import {
  ListCheckIcon,
  LoaderIcon,
  PlusIcon,
  SaveIcon,
  Trash2Icon,
} from "lucide-react";
import React, { useState } from "react";
import Select from "../ui/Select";
import Button from "../ui/Button";
import { saveSOPSettings } from "@/actions/userActions";
import { toast } from "sonner";

const sopTypeOptions = [
  { label: <span>Edits</span>, value: "Edits" },
  { label: <span>Captions</span>, value: "Captions" },
  { label: <span>Subtitles</span>, value: "Subtitles" },
  { label: <span>Music</span>, value: "Music" },
  { label: <span>Cover Photo</span>, value: "Cover Photo" },
  { label: <span>Other</span>, value: "Other" },
];

export default function ClientSOPSettings({ client }: { client: UserType }) {
  const [SOPSettings, setSOPSettings] = useState<SOPSettingType[]>(
    client.SOPSettings,
  );
  const [type, setType] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const cannotSubmit = !type || !content.trim();

  function addNewSOPSetting(e: React.FormEvent) {
    e.preventDefault();
    if (cannotSubmit) return;
    setSOPSettings((prev) => [
      ...prev,
      { id: new Date().toISOString(), type, content },
    ]);
    setType("");
    setContent("");
  }

  function deleteSOPSetting(setting: SOPSettingType) {
    setSOPSettings((prev) => prev.filter((sett) => sett.id !== setting.id));
  }

  async function saveSettings() {
    setLoading(true);
    const { error } = await saveSOPSettings(client.id, SOPSettings);
    if (error !== null) {
      toast.error(error);
    } else {
      toast.success("Client SOP settings saved successfully!");
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-4 rounded-md border border-gray-300 bg-white p-4 sm:p-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold sm:text-xl lg:text-2xl">
        <ListCheckIcon className="h-5 w-5" />
        SOP Settings for {client.fullName}
      </h2>
      <form onSubmit={addNewSOPSetting} className="flex gap-4">
        <Select
          value={type}
          onChange={(value) => setType(value)}
          options={sopTypeOptions}
          showCheckmark
          className="w-32"
          dropdownPosition="top"
        />
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="bg-background w-0 flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm"
        />
        <Button disabled={cannotSubmit} type="submit">
          <PlusIcon size={16} /> Add
        </Button>
      </form>

      <hr className="border-gray-200" />

      <div className="flex flex-col gap-2">
        {sopTypeOptions.map((opt) => (
          <div key={opt.value} className="flex flex-col gap-2">
            <h3 className="font-semibold uppercase">{opt.value}</h3>
            <div key={opt.value} className="flex flex-col gap-1 pl-4 text-sm">
              {SOPSettings.filter((setting) => setting.type === opt.value).map(
                (setting) => (
                  <div className="flex justify-between" key={setting.id}>
                    <label
                      htmlFor={setting.id}
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        id={setting.id}
                        className="accent-accent-black"
                      />
                      {setting.content}
                    </label>
                    <button
                      onClick={() => deleteSOPSetting(setting)}
                      className="text-accent-red hover:bg-accent-red/10 rounded-md p-2 duration-200"
                    >
                      <Trash2Icon size={16} />
                    </button>
                  </div>
                ),
              )}
            </div>
          </div>
        ))}
      </div>

      <hr className="border-gray-200" />

      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={loading}>
          {loading ? (
            <>
              <LoaderIcon className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <SaveIcon className="h-4 w-4" />
              Save SOP Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
