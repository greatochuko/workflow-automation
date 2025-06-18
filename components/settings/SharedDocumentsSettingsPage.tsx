import { UserType } from "@/types/user";
import {
  EditIcon,
  FileTextIcon,
  PlusIcon,
  TrashIcon,
  UsersIcon,
} from "lucide-react";
import React, { useState } from "react";
import Button from "../ui/Button";
import { SharedDocumentType } from "@/types/sharedDocument";
import SharedDocumentModal from "./SharedDocumentModal";
import DeleteSharedDocumentModal from "../shared-document/DeleteSharedDocumentModal";
import { format } from "date-fns";
import Avatar from "../ui/Avatar";

export default function SharedDocumentsSettingsPage({
  clients,
  visible,
  sharedDocuments,
}: {
  clients: UserType[];
  visible: boolean;
  sharedDocuments: SharedDocumentType[];
}) {
  const [sharedDocumentList, setSharedDocumentList] = useState(sharedDocuments);
  const [createDocumentModalOpen, setCreateDocumentModalOpen] = useState(false);
  const [documentToEdit, setDocumentToEdit] =
    useState<SharedDocumentType | null>(null);
  const [documentToDelete, setDocumentToDelete] =
    useState<SharedDocumentType | null>(null);

  if (!visible) return;

  function updateDocumentList(newDocument: SharedDocumentType) {
    if (sharedDocumentList.some((doc) => doc.id === newDocument.id)) {
      setSharedDocumentList((prev) =>
        prev.map((doc) => (doc.id === newDocument.id ? newDocument : doc)),
      );
    } else {
      setSharedDocumentList((prev) => [...prev, newDocument]);
    }
  }

  function removeDocumentFromList(deletedDocumentId: string) {
    setSharedDocumentList((prev) =>
      prev.filter((doc) => doc.id !== deletedDocumentId),
    );
  }

  return (
    <>
      <div className="flex max-w-full flex-col gap-4 rounded-lg border border-gray-300 bg-white p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-semibold sm:text-2xl">
              <UsersIcon className="h-5 w-5" /> Shared Documents
            </h2>
            <p className="text-sm text-gray-500">
              Create and manage shared documents with specific users
            </p>
          </div>
          <Button onClick={() => setCreateDocumentModalOpen(true)}>
            <PlusIcon className="h-4 w-4" /> Create Document
          </Button>
        </div>
        {sharedDocumentList.length > 0 ? (
          <div className="max-w-full overflow-x-auto text-sm">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Title
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Assigned Client
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Last Updated
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sharedDocuments.map((doc) => (
                  <tr key={doc.id}>
                    <td className="max-w-40 overflow-hidden px-4 py-2 font-medium overflow-ellipsis whitespace-nowrap">
                      {doc.title}
                    </td>
                    <td className="flex items-center gap-2 overflow-hidden px-4 py-2 font-medium overflow-ellipsis whitespace-nowrap">
                      <Avatar user={doc.client} className="h-8 w-8" />
                      <span className="flex-1">{doc.client.fullName}</span>
                    </td>
                    <td className="px-4 py-2 font-medium">
                      {format(new Date(doc.updatedAt), "MMM d, yyyy")}
                    </td>
                    <td className="flex items-center gap-4 px-4 py-2 font-medium">
                      <Button
                        onClick={() => setDocumentToEdit(doc)}
                        variant="outline"
                        className="text-accent hover:bg-accent px-3 hover:text-white"
                      >
                        <EditIcon size={16} />
                      </Button>
                      <Button
                        onClick={() => setDocumentToDelete(doc)}
                        variant="outline"
                        className="text-accent-red hover:bg-accent-red px-3 hover:text-white"
                      >
                        <TrashIcon size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-8">
            <FileTextIcon size={48} className="text-gray-500" />
            <h4 className="text-lg font-medium">No Shared Documents</h4>
            <p className="text-gray-500">
              Create your first shared document to get started.
            </p>
          </div>
        )}
      </div>

      <SharedDocumentModal
        open={createDocumentModalOpen}
        closeModal={() => setCreateDocumentModalOpen(false)}
        clients={clients}
        updateDocumentList={updateDocumentList}
      />

      {documentToEdit && (
        <SharedDocumentModal
          key={"Edit"}
          open={!!documentToEdit}
          closeModal={() => setDocumentToEdit(null)}
          clients={clients}
          updateDocumentList={updateDocumentList}
          document={documentToEdit}
        />
      )}

      {documentToDelete && (
        <DeleteSharedDocumentModal
          closeModal={() => setDocumentToDelete(null)}
          open={!!documentToDelete}
          document={documentToDelete}
          removeDocumentFromList={removeDocumentFromList}
        />
      )}
    </>
  );
}
