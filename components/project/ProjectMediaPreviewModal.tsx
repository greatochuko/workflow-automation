import React from "react";
import ModalContainer from "../ui/ModalContainer";
import Image from "next/image";
import { XIcon } from "lucide-react";

export default function ProjectMediaPreviewModal({
  open,
  closeModal,
  media,
}: {
  open: boolean;
  closeModal: () => void;
  media: { type: string; url: string } | null;
}) {
  return (
    <ModalContainer open={open} closeModal={closeModal}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative h-[85vh] w-[90%] max-w-5xl"
      >
        {media?.type.startsWith("image") && (
          <Image
            src={media.url}
            fill
            sizes="1024px"
            alt="Project Media"
            className="object-contain"
          />
        )}
        {media?.type.startsWith("video") && (
          <video src={media.url} controls className="mx-auto h-full" />
        )}
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 rounded-full bg-black/50 p-2 text-gray-300 duration-200 hover:text-white"
        >
          <XIcon className="h-4 w-4" />
        </button>
      </div>
    </ModalContainer>
  );
}
