"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { UploadIcon } from "lucide-react";
import UploadVideoModal from "./UploadVideoModal";

export default function UploadVideoButton({
  videoTypes,
}: {
  videoTypes: string[];
}) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setModalIsOpen(true)}>
        <UploadIcon className="h-4 w-4" />
        <span className="sm:hidden">New Video</span>
        <span className="hidden sm:inline">Upload New Video</span>
      </Button>
      <UploadVideoModal
        open={modalIsOpen}
        closeModal={() => setModalIsOpen(false)}
        videoTypes={videoTypes}
      />
    </>
  );
}
