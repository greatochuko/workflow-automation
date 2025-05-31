import React, { useState } from "react";
import ModalContainer from "../ui/ModalContainer";
import { LoaderIcon, TrashIcon } from "lucide-react";
import Button from "../ui/Button";
import { toast } from "sonner";
import { deleteUser } from "@/actions/userActions";

export default function DeleteUserModal({
  open,
  closeModal,
  userName,
  userId,
  removeFromUserList,
}: {
  open: boolean;
  closeModal: () => void;
  userName: string;
  userId: string;
  removeFromUserList(deletedUserId: string): void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDeleteUser() {
    setLoading(true);
    const { error } = await deleteUser(userId);
    if (error === null) {
      toast.success("User deleted successfully");
      closeModal();
      removeFromUserList(userId);
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

        <h2 className="mb-2 text-lg font-semibold">Delete User</h2>
        <p className="mb-4 text-sm text-gray-700">
          Are you sure you want to delete the user{" "}
          <span className="font-semibold">{userName}</span>
        </p>
        <div className="flex w-full flex-col gap-4">
          <Button
            disabled={loading}
            className="bg-accent-red hover:bg-accent-red/90 disabled:bg-accent-red/50 rounded-full py-4"
            onClick={handleDeleteUser}
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
