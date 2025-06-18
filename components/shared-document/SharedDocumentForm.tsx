"use client";

import React, { useState } from "react";
import Button from "../ui/Button";
import { LoaderIcon, SaveIcon } from "lucide-react";
import { updateSharedDocument } from "@/actions/sharedDocumentActions";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { SharedDocumentType } from "@/types/sharedDocument";

export default function SharedDocumentForm({
  document,
}: {
  document: SharedDocumentType;
}) {
  const [content, setContent] = useState(document?.content || "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await updateSharedDocument(
      document.id,
      document.title,
      content,
      document.clientId,
    );
    if (data) {
      toast.success("Document saved successfully!");
    } else {
      toast.error(error);
    }
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-1 flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:p-6"
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">{document.title}</h2>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <textarea
          id="content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
          placeholder="Enter the content of your document here"
          className="bg-background w-full flex-1 resize-none rounded-md border border-gray-300 px-4 py-2 font-mono text-sm"
        />
      </div>

      {document && (
        <p className="text-xs text-gray-500">
          Last edited
          {document.lastEditedBy
            ? ` by: ${document.lastEditedBy.fullName} • `
            : ": "}
          {formatDistanceToNow(document.updatedAt ?? document.createdAt, {
            addSuffix: true,
          })}
        </p>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <LoaderIcon className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <SaveIcon className="h-4 w-4" />
              Save Document
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
