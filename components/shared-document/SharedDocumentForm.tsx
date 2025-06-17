"use client";

import React, { useState } from "react";
import Button from "../ui/Button";
import { LoaderIcon, SaveIcon } from "lucide-react";
import { createSharedDocument } from "@/actions/sharedDocumentActions";
import { toast } from "sonner";

export default function SharedDocumentForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const data = await createSharedDocument(title, content);
    if (data?.error) {
      toast.error(data.error);
    }
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-1 flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:p-6"
    >
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium" htmlFor="title">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title for this document"
          className="bg-background w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <label className="text-sm font-medium" htmlFor="content">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter the content of your document here"
          className="bg-background w-full flex-1 resize-none rounded-md border border-gray-300 px-4 py-2 font-mono text-sm"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <LoaderIcon className="h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <SaveIcon className="h-4 w-4" />
              Create Document
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
