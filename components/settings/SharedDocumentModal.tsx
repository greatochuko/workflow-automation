import React, { useState } from "react";
import ModalContainer from "../ui/ModalContainer";
import { XIcon } from "lucide-react";
import Select from "../ui/Select";
import { UserType } from "@/types/user";
import Button from "../ui/Button";
import {
  createSharedDocument,
  updateSharedDocument,
} from "@/actions/sharedDocumentActions";
import { toast } from "sonner";
import { SharedDocumentType } from "@/types/sharedDocument";

export default function SharedDocumentModal({
  open,
  closeModal,
  clients,
  updateDocumentList,
  document,
}: {
  open: boolean;
  closeModal: () => void;
  clients: UserType[];
  updateDocumentList(document: SharedDocumentType): void;
  document?: SharedDocumentType;
}) {
  const [title, setTitle] = useState(document?.title || "");
  const [content, setContent] = useState(document?.content || "");
  const [selectedClientId, setSelectedClientId] = useState(
    document?.clientId || "",
  );
  const [loading, setLoading] = useState(false);

  const cannotSubmit = !title.trim() || !content.trim() || !selectedClientId;

  async function handleCreateSharedDocument(e: React.FormEvent) {
    e.preventDefault();
    if (cannotSubmit) return;
    setLoading(true);
    const { data, error } = await createSharedDocument(
      title,
      content,
      selectedClientId,
    );
    if (data) {
      updateDocumentList(data);
      toast.success("Document created successfully!");
      closeModal();
    } else {
      toast.error(error);
    }
    setLoading(false);
  }

  async function handleEditSharedDocument(e: React.FormEvent) {
    e.preventDefault();
    if (cannotSubmit || !document) return;
    setLoading(true);
    const { data, error } = await updateSharedDocument(
      document.id,
      title,
      content,
      selectedClientId,
    );
    if (data) {
      updateDocumentList(data);
      toast.success("Document saved successfully!");
      closeModal();
    } else {
      toast.error(error);
    }
    setLoading(false);
  }

  return (
    <ModalContainer open={open} closeModal={closeModal}>
      <form
        onSubmit={
          document ? handleEditSharedDocument : handleCreateSharedDocument
        }
        className="flex h-[85vh] w-[90%] max-w-xl flex-col rounded-lg bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 pb-2 sm:p-6 sm:pb-2">
          <h4 className="text-lg font-semibold">Create Shared Document</h4>
          <button
            onClick={closeModal}
            className="hover:text-foreground p-1 text-gray-500 duration-200"
          >
            <XIcon size={16} />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-hidden overflow-y-auto p-4 pt-2 text-sm sm:p-6 sm:pt-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="font-medium">
              Document Title
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
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="selectedUser" className="font-medium">
              Select Client
            </label>
            <Select
              value={selectedClientId}
              onChange={(value) => setSelectedClientId(value)}
              options={clients.map((client) => ({
                label: <span>{client.fullName}</span>,
                value: client.id,
              }))}
              showCheckmark
              placeholder="Select Client"
              disabled={loading}
            />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="content" className="font-medium">
              Initial Content
            </label>
            <textarea
              id="content"
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}
              placeholder="Enter a title for this document"
              className="bg-background w-full flex-1 resize-none rounded-md border border-gray-300 px-4 py-2 text-sm"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={cannotSubmit || loading}>
              {document
                ? loading
                  ? "Saving..."
                  : "Save Document"
                : loading
                  ? "Creating..."
                  : "Create Document"}
            </Button>
          </div>
        </div>
      </form>
    </ModalContainer>
  );
}
