import React, { useState } from "react";
import ModalContainer from "../ui/ModalContainer";
import { LoaderIcon, LogOutIcon } from "lucide-react";
import Button from "../ui/Button";
import { logoutUser } from "@/actions/authActions";

export default function LogoutModal({
  open,
  closeModal,
}: {
  open: boolean;
  closeModal: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await logoutUser();
    setLoading(false);
    closeModal();
  }

  return (
    <ModalContainer open={open} closeModal={closeModal}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`text-accent-black flex w-[90%] max-w-sm flex-col items-center gap-2 rounded-lg bg-white p-4 px-6 text-center shadow duration-200 ${open ? "" : "scale-105"}`}
      >
        <span className="bg-accent-black rounded-full p-3 text-white">
          <LogOutIcon className="h-5 w-5" />
        </span>

        <h2 className="mb-2 text-lg font-semibold">Confirm Logout</h2>
        <p className="mb-4 text-sm text-gray-700">
          Are you sure you want to log out?
        </p>
        <div className="flex w-full flex-col gap-4">
          <Button
            disabled={loading}
            className="rounded-full py-4"
            onClick={handleLogout}
          >
            {loading ? (
              <>
                <LoaderIcon className="h-4 w-4 animate-spin" /> Logging out...
              </>
            ) : (
              "Logout"
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
