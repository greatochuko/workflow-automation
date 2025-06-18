import React, { useState } from "react";
import ModalContainer from "../ui/ModalContainer";
import { LoaderIcon, TrashIcon } from "lucide-react";
import Button from "../ui/Button";
import { toast } from "sonner";
import { SharedDocumentType } from "@/types/sharedDocument";
import { deleteSharedDocument } from "@/actions/sharedDocumentActions";

export default function DeleteSharedDocumentModal({
  open,
  closeModal,
  document,
}: {
  open: boolean;
  closeModal: () => void;
  document: SharedDocumentType;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDeleteDocument() {
    setLoading(true);
    const res = await deleteSharedDocument(document.id);
    if (res?.error) {
      toast.success(res.error);
    }
    setLoading(false);
  }

  return (
    <ModalContainer open={open} closeModal={closeModal}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`text-foreground flex w-[90%] max-w-sm flex-col items-center gap-2 rounded-lg bg-white p-4 px-6 text-center shadow duration-200 ${open ? "" : "scale-105"}`}
      >
        <span className="bg-accent-red rounded-full p-3 text-white">
          <TrashIcon className="h-5 w-5" />
        </span>

        <h2 className="mb-2 text-lg font-semibold">Delete Shared Document</h2>
        <p className="mb-4 text-sm text-gray-700">
          Are you sure you want to delete Document{" "}
          <span className="font-semibold">{document.title}</span>
        </p>
        <div className="flex w-full flex-col gap-4">
          <Button
            disabled={loading}
            className="bg-accent-red hover:bg-accent-red/90 disabled:bg-accent-red/50 rounded-full py-4"
            onClick={handleDeleteDocument}
          >
            {loading ? (
              <>
                <LoaderIcon className="h-4 w-4 animate-spin" /> Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
          <Button
            className="rounded-full border border-gray-300 bg-white py-4 text-gray-700 hover:bg-gray-100"
            onClick={closeModal}
          >
            Cancel
          </Button>
        </div>
      </div>
    </ModalContainer>
  );
}
