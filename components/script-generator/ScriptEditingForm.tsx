"use client";

import React, { useMemo, useState } from "react";
import Button from "../ui/Button";
import {
  ArrowLeftIcon,
  CopyIcon,
  EyeIcon,
  LoaderIcon,
  SaveIcon,
} from "lucide-react";
import { VideoScriptType } from "@/types/videoScript";
import { saveVideoScript } from "@/actions/scriptActions";
import { toast } from "sonner";

export default function ScriptEditingForm({
  videoScript: originalVideoScript,
}: {
  videoScript: VideoScriptType;
}) {
  const [videoScript, setVideoScript] = useState(originalVideoScript);
  const [loading, setLoading] = useState(false);
  const [hookLine, setHookLine] = useState(videoScript.content.hookLine);
  const [cta, setCta] = useState(videoScript.content.cta);
  const [body, setBody] = useState(videoScript.content.body);
  const [showFinalScript, setShowFinalScript] = useState(videoScript.isSaved);

  const scriptContentHasChanged = useMemo(() => {
    return (
      hookLine.trim() !== videoScript.content.hookLine.trim() ||
      body.trim() !== videoScript.content.body.trim() ||
      cta.trim() !== videoScript.content.cta.trim()
    );
  }, [hookLine, cta, body, videoScript.content]);

  const cannotSubmit =
    !body.trim() || !cta.trim() || !hookLine.trim() || loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (cannotSubmit) {
      return;
    }

    setLoading(true);
    const { data, error } = await saveVideoScript(videoScript.id, {
      body,
      cta,
      hookLine,
    });
    if (data) {
      setVideoScript(data);
      toast.success("Script updated successfully");
    } else {
      toast.error(error);
    }
    setLoading(false);
  }

  const fullScript = `${hookLine}\n\n${body}\n\n${cta}`;

  function handleCopyScript() {
    navigator.clipboard
      .writeText(fullScript)
      .then(() => toast.success("Script copied to clipboard"))
      .catch(() => toast.error("Failed to copy script"));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-fit w-full flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:gap-6 sm:p-6"
    >
      {showFinalScript ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Button onClick={() => setShowFinalScript(false)} variant="outline">
              <ArrowLeftIcon className="h-4 w-4" /> Back to editor
            </Button>
            <Button onClick={handleCopyScript} variant="outline">
              <CopyIcon className="h-4 w-4" /> Copy Script
            </Button>
          </div>
          <div className="space-y-2">
            <textarea
              value={fullScript}
              readOnly
              rows={20}
              className="w-full resize-none rounded-lg bg-gray-50 p-4 font-mono text-base sm:p-6"
            />
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-lg font-semibold sm:text-xl">
              {videoScript.isSaved ? "View" : "Edit"} Your Script
            </h2>
            <div className="flex items-center gap-4">
              {!videoScript.isSaved && (
                <Button
                  type="submit"
                  disabled={
                    videoScript.isSaved || !scriptContentHasChanged || loading
                  }
                >
                  {loading ? (
                    <>
                      <LoaderIcon className="h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <SaveIcon className="h-4 w-4" /> Save Changes
                    </>
                  )}
                </Button>
              )}
              <Button onClick={() => setShowFinalScript(true)}>
                <EyeIcon className="h-4 w-4" /> View Final Script
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor={"hook-line"} className="text-sm font-medium">
              Hook Line
            </label>
            <textarea
              name={"hook-line"}
              id={"hook-line"}
              rows={4}
              disabled={videoScript.isSaved || loading}
              value={hookLine}
              onChange={(e) => setHookLine(e.target.value)}
              placeholder={"Enter your hook line..."}
              className="bg-background mx-1 resize-none rounded-md border border-gray-300 px-3 py-2 text-sm"
            ></textarea>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor={"body"} className="text-sm font-medium">
              Body
            </label>
            <textarea
              name={"body"}
              id={"body"}
              rows={10}
              disabled={videoScript.isSaved || loading}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={"Enter your main content..."}
              className="bg-background mx-1 resize-none rounded-md border border-gray-300 px-3 py-2 text-sm"
            ></textarea>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor={"call-to-action"} className="text-sm font-medium">
              Call-to-action
            </label>
            <textarea
              name={"call-to-action"}
              id={"call-to-action"}
              rows={4}
              disabled={videoScript.isSaved || loading}
              value={cta}
              onChange={(e) => setCta(e.target.value)}
              placeholder={"Enter your call to action..."}
              className="bg-background mx-1 resize-none rounded-md border border-gray-300 px-3 py-2 text-sm"
            ></textarea>
          </div>
        </>
      )}

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
        <p className="text-sm text-blue-800">
          <strong>Topic:</strong> {videoScript.topic} |{" "}
          <strong>Duration:</strong> {videoScript.durationInSeconds} seconds
        </p>
      </div>
    </form>
  );
}
