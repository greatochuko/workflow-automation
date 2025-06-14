import React, { useState } from "react";
import ModalContainer from "../ui/ModalContainer";
import { Link2OffIcon, LoaderIcon } from "lucide-react";
import Button from "../ui/Button";
import { toast } from "sonner";
import { disconnectInstagramAccount } from "@/actions/authActions";

export default function DisconnectInstagramModal({
  open,
  closeModal,
  removeInstagramAccountFromUser,
}: {
  open: boolean;
  closeModal: () => void;
  removeInstagramAccountFromUser: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDisconnectInstagram() {
    setLoading(true);
    const { data } = await disconnectInstagramAccount();
    if (data) {
      toast.success("Account disconnected successfully");
      removeInstagramAccountFromUser();
      closeModal();
    } else {
      toast.error("An error occured disconnecting instagram account");
    }
    setLoading(false);
  }

  return (
    <ModalContainer open={open} closeModal={closeModal}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`text-foreground flex w-[90%] max-w-md flex-col items-center gap-2 rounded-lg bg-white p-4 px-6 text-center shadow duration-200 ${open ? "" : "scale-105"}`}
      >
        <span className="rounded-full bg-[#E4405F] p-3 text-white">
          <Link2OffIcon className="h-5 w-5" />
        </span>

        <h2 className="mb-2 text-lg font-semibold">
          Disconnect Instagram Account
        </h2>
        <p className="mb-4 text-sm text-gray-700">
          Are you sure you want to disconnect your Instagram account? This
          action cannot be undone and may affect any automations or integrations
          that rely on Instagram.
        </p>
        <div className="flex w-full flex-col gap-4">
          <Button
            disabled={loading}
            className="rounded-full bg-[#E4405F] py-4 hover:bg-[#E4405F]/90 disabled:bg-[#E4405F]/50"
            onClick={handleDisconnectInstagram}
          >
            {loading ? (
              <>
                <LoaderIcon className="h-4 w-4 animate-spin" /> Disconnecting...
              </>
            ) : (
              "Disconnect"
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
