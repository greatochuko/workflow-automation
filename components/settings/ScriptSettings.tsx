import React, { useState } from "react";
import Button from "../ui/Button";
import {
  ChevronDownIcon,
  LoaderIcon,
  PlusIcon,
  SaveIcon,
  Trash2Icon,
} from "lucide-react";
import { UserType } from "@/types/user";
import { toast } from "sonner";
import { saveUserVideoScriptSettings } from "@/actions/userActions";

export default function ScriptSettings({ client }: { client: UserType }) {
  const [examples, setExamples] = useState<string[]>([]);
  const [newExample, setNewExample] = useState("");
  const [expandedExamples, setExpandedExamples] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const addExample = () => {
    if (newExample.trim()) {
      setExamples((prev) => [...prev, newExample.trim()]);
      setNewExample("");
    }
  };

  const removeExample = (index: number) => {
    setExamples((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleExample = (index: number) => {
    if (expandedExamples.includes(index)) {
      setExpandedExamples((prev) => prev.filter((n) => n !== index));
    } else {
      setExpandedExamples((prev) => [...prev, index]);
    }
  };

  const saveSettings = async () => {
    setLoading(true);

    const { error } = await saveUserVideoScriptSettings(client.id, examples);

    if (error === null) {
      toast.success("Video Script settings saved successfully!");
    } else {
      toast.error("Failed to save video script settings. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 rounded-md border border-gray-300 bg-white p-4 sm:p-6">
      <div>
        <h2 className="text-lg font-semibold sm:text-xl lg:text-2xl">
          Video Script Settings
        </h2>
        <p className="text-sm text-gray-500">
          Configure video script generation settings for {client.fullName}
        </p>
      </div>

      <hr className="border-gray-200" />

      <h4 className="font-semibold">Video Script Examples</h4>
      {examples.length ? (
        examples.map((example, index) => (
          <div key={index} className="rounded-lg bg-gray-100 p-4">
            <div className="flex items-center justify-between">
              <h5
                onClick={() => toggleExample(index)}
                className="cursor-pointer text-xs font-medium hover:underline"
              >
                Example {index + 1}
              </h5>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleExample(index)}
                  className="hover:bg-accent rounded-md p-2 duration-200 hover:text-white"
                >
                  <ChevronDownIcon
                    className={`h-4 w-4 duration-200 ${expandedExamples.includes(index) ? "rotate-180" : ""}`}
                  />
                </button>
                <button
                  onClick={() => removeExample(index)}
                  className="hover:bg-accent-red rounded-md p-2 duration-200 hover:text-white"
                >
                  <Trash2Icon className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div
              className={`overflow-hidden duration-300 ${expandedExamples.includes(index) ? "mt-2 max-h-80" : "max-h-0"}`}
            >
              <textarea
                disabled
                value={example}
                className={`h-80 w-full rounded border bg-white p-3 font-mono text-sm whitespace-pre-wrap`}
              ></textarea>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">No Script examples added yet.</p>
      )}

      <hr className="border-gray-200" />

      <div className="flex flex-col gap-2">
        <label htmlFor="new-script-example" className="text-sm font-medium">
          Add New Script Example
        </label>
        <textarea
          id="new-script-example"
          value={newExample}
          onChange={(e) => setNewExample(e.target.value)}
          placeholder="Paste your Video Script example here...&#10;&#10;Include subject line, body text, and any formatting you want to preserve."
          rows={8}
          className="bg-background resize-none rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <Button
          onClick={addExample}
          disabled={!newExample.trim()}
          className="w-full"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Video Script Example
        </Button>
      </div>

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
              Save Video Script Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
