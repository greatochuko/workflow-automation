"use client";

import React, { useState } from "react";
import Button from "../ui/Button";
import { LoaderIcon, SaveIcon, TrashIcon } from "lucide-react";
import {
  createSharedDocument,
  updateSharedDocument,
} from "@/actions/sharedDocumentActions";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { SharedDocumentType } from "@/types/sharedDocument";
import DeleteSharedDocumentModal from "./DeleteSharedDocumentModal";

export default function SharedDocumentForm({
  document,
  userId,
}: {
  document?: SharedDocumentType;
  userId?: string;
}) {
  const [title, setTitle] = useState(document?.title || "");
  const [content, setContent] = useState(document?.content || "");
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (document) {
      const { data, error } = await updateSharedDocument(
        document.id,
        title,
        content,
      );
      if (data) {
        toast.success("Document saved successfully!");
      } else {
        toast.error(error);
      }
    } else {
      const data = await createSharedDocument(title, content);
      if (data?.error) {
        toast.error(data.error);
      }
    }
    setLoading(false);
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:p-6"
      >
        <div className="flex flex-col gap-2">
          {document && document.createdById !== userId ? (
            <h2 className="text-xl font-semibold">{document.title}</h2>
          ) : (
            <>
              <label className="text-sm font-medium" htmlFor="title">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
                placeholder="Enter a title for this document"
                className="bg-background w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
              />
            </>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          {(!document || document.createdById === userId) && (
            <label className="text-sm font-medium" htmlFor="content">
              Content
            </label>
          )}
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

        <div className="flex justify-between">
          {document?.createdById === userId && (
            <Button
              className="bg-accent-red hover:bg-accent-red/85"
              disabled={loading}
              onClick={() => setDeleteModalOpen(true)}
            >
              <TrashIcon className="h-4 w-4" />
              Delete Document
            </Button>
          )}
          <Button type="submit" disabled={loading} className="ml-auto">
            {loading ? (
              <>
                <LoaderIcon className="h-4 w-4 animate-spin" />
                {document ? "Saving" : "Creating"}...
              </>
            ) : (
              <>
                <SaveIcon className="h-4 w-4" />
                {document ? "Save" : "Create"} Document
              </>
            )}
          </Button>
        </div>
      </form>

      {document && (
        <DeleteSharedDocumentModal
          closeModal={() => setDeleteModalOpen(false)}
          open={deleteModalOpen}
          document={document}
        />
      )}
    </>
  );
}
