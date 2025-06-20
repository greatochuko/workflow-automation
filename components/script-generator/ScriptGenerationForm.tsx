"use client";

import React, { useState } from "react";
import Select from "../ui/Select";
import Button from "../ui/Button";
import { LoaderIcon, SparklesIcon } from "lucide-react";
import { createVideoScript } from "@/actions/scriptActions";
import { toast } from "sonner";

export default function ScriptGenerationForm({ userId }: { userId?: string }) {
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [minutes, setMinutes] = useState("0");
  const [seconds, setSeconds] = useState("30");

  const cannotSubmit = !topic.trim() || !description.trim() || loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      cannotSubmit ||
      typeof Number(minutes) !== "number" ||
      typeof Number(seconds) !== "number"
    ) {
      return;
    }

    setLoading(true);
    const durationInSeconds = Number(minutes) * 60 + Number(seconds);
    const res = await createVideoScript(
      topic,
      description,
      durationInSeconds,
      userId,
    );
    if (res?.error) {
      toast.error(res.error);
    }
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-fit min-w-[340px] flex-1 flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:gap-6 sm:p-6"
    >
      <h2 className="text-lg font-semibold sm:text-xl">
        Generate Video Script
      </h2>

      <div className="flex flex-col gap-2">
        <label htmlFor={"topic"} className="text-sm font-medium">
          Video Topic
        </label>
        <input
          name={"topic"}
          id={"topic"}
          disabled={loading}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="What's the main topic of your video?"
          className="bg-background mx-1 resize-none rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={"description"} className="text-sm font-medium">
          Video Description
        </label>
        <textarea
          name={"description"}
          id={"description"}
          rows={4}
          disabled={loading}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={"Describe what your video should be about..."}
          className="bg-background mx-1 resize-none rounded-md border border-gray-300 px-3 py-2 text-sm"
        ></textarea>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={"topic"} className="text-sm font-medium">
          Video Length (Approximate)
        </label>
        <div className="flex items-center gap-2">
          <Select
            options={[0, 1, 2, 3].map((n) => ({
              label: <span>{n}</span>,
              value: n.toString(),
            }))}
            value={minutes}
            onChange={(value) => setMinutes(value)}
            disabled={loading}
            showCheckmark
            placeholder="Minutes"
            className="w-20 focus-visible:outline"
          />
          <span className="text-sm text-gray-500">minutes</span>
          <Select
            options={[0, 15, 30, 45].map((n) => ({
              label: <span>{n}</span>,
              value: n.toString(),
            }))}
            value={seconds}
            onChange={(value) => setSeconds(value)}
            disabled={loading}
            showCheckmark
            placeholder="Seconds"
            className="w-20 focus-visible:outline"
          />
          <span className="text-sm text-gray-500">seconds</span>
        </div>
      </div>

      <Button type="submit" disabled={cannotSubmit}>
        {loading ? (
          <>
            <LoaderIcon className="h-4 w-4 animate-spin" /> Generating...
          </>
        ) : (
          <>
            <SparklesIcon className="h-4 w-4" /> Generate Script
          </>
        )}
      </Button>
    </form>
  );
}
