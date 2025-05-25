import React from "react";
import ModalContainer from "../ui/ModalContainer";
import { ProjectType } from "@/types/project";
import { CloudDownloadIcon, ImageIcon, VideoIcon, XIcon } from "lucide-react";
import { getEventColorClass } from "../client-dashboard/CalendarDayCell";
import Link from "next/link";

export default function ProjectDetailsModal({
  open,
  closeModal,
  project,
  showAiResponse = false,
}: {
  open: boolean;
  closeModal: () => void;
  project: ProjectType | null;
  showAiResponse?: boolean;
}) {
  return (
    <ModalContainer open={open} closeModal={closeModal}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-background flex max-h-[85%] w-[90%] max-w-3xl flex-col gap-4 overflow-hidden overflow-y-auto rounded-md p-4"
      >
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold sm:text-xl">{project?.title}</h4>
          <button
            onClick={closeModal}
            className="hover:text-foreground p-2 text-gray-500 duration-200"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-wrap justify-between whitespace-nowrap">
          <p className="text-sm text-gray-500">
            Scheduled for{" "}
            {project?.scheduledDate
              ? new Date(project.scheduledDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "N/A"}
          </p>
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium text-white ${project?.status ? getEventColorClass(project.status) : "bg-gray-200 text-gray-600"}`}
            title={project?.status || "No status"}
          >
            {project?.status.replace("_", "-").toLowerCase() || "No status"}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <h5>Project Files</h5>
          <ul>
            {project?.files.map((file) => (
              <li
                key={file.id}
                className="flex items-center gap-2 rounded-md border border-gray-200 p-2"
              >
                <span className="self-start p-2 pr-0">
                  {file.type.startsWith("image/") ? (
                    <ImageIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <VideoIcon className="h-5 w-5 text-gray-500" />
                  )}
                </span>
                <div className="flex flex-1 flex-col gap-1">
                  <p className="text-sm font-medium"> {file.name}</p>
                  {file.description && (
                    <p className="text-xs text-gray-500">{file.description}</p>
                  )}
                </div>
                <Link
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Download File"
                  className="hover:text-accent p-2 text-gray-500 duration-200"
                >
                  <CloudDownloadIcon className="h-5 w-5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3 rounded-md border border-gray-200 bg-white p-4">
          <div className="flex flex-col gap-1">
            <h4 className="font-medium">Description</h4>
            <p className="text-sm text-gray-500">{project?.description}</p>
          </div>
          {showAiResponse && (
            <div className="flex flex-col gap-1">
              <h4 className="font-medium">AI Generated Caption</h4>
              <p className="text-sm text-gray-500">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis
                nobis, reprehenderit nam unde accusamus natus aspernatur ipsum
                hic beatae. Tempora rerum libero reprehenderit reiciendis saepe?
                Expedita sint eos consequuntur magnam.
              </p>
            </div>
          )}
        </div>
      </div>
    </ModalContainer>
  );
}
