"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { UploadIcon } from "lucide-react";
import ProjectCreationModal from "./ProjectCreationModal";
import { ProjectType } from "@/types/project";
import { VideoScriptType } from "@/types/videoScript";

export default function UploadVideoButton({
  videoTypes,
  updateProjects,
  videoScripts,
}: {
  videoTypes: string[];
  updateProjects: (project: ProjectType) => void;
  videoScripts: VideoScriptType[];
}) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setModalIsOpen(true)} className="px-3 sm:px-4">
        <UploadIcon className="h-4 w-4" />
        <span className="sm:hidden">New Video</span>
        <span className="hidden sm:inline">Upload New Video</span>
      </Button>
      <ProjectCreationModal
        open={modalIsOpen}
        closeModal={() => setModalIsOpen(false)}
        videoTypes={videoTypes}
        updateProjects={updateProjects}
        videoScripts={videoScripts}
      />
    </>
  );
}
