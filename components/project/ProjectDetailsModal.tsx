import React from "react";
import ModalContainer from "../ui/ModalContainer";
import { ProjectType } from "@/types/project";
import {
  CloudDownloadIcon,
  CopyIcon,
  ImageIcon,
  VideoIcon,
  XIcon,
} from "lucide-react";
import { getEventColorClass } from "./CalendarDayCell";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";

const AIGeneratedResponse = {
  Hook: "Discover the magic of AI-generated content with our latest project!",
  "CTA 1":
    "Discover the magic of AI-generated content with our latest project!",
  "CTA 2":
    "Discover the magic of AI-generated content with our latest project!",
  "Caption Content":
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
};

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
        className={`bg-background flex max-h-[85%] w-[90%] max-w-3xl flex-col gap-4 overflow-hidden overflow-y-auto rounded-md p-4 ${open ? "" : "scale-105"}`}
      >
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold sm:text-xl">
            Project Title: {project?.title}
          </h4>
          <button
            onClick={closeModal}
            className="hover:text-foreground self-start p-2 text-gray-500 duration-200"
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

        <div className="flex flex-col gap-1">
          <h4 className="font-medium">Description</h4>
          <p className="text-sm text-gray-500">{project?.description}</p>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="font-medium">Project Files</h4>
          <ul className="flex flex-col gap-2">
            {project?.files.map((file) => (
              <li
                key={file.id}
                className="flex items-start gap-2 rounded-md border border-gray-200 bg-white p-2"
              >
                {file.thumbnailUrl ? (
                  <Image
                    src={file.thumbnailUrl}
                    alt={file.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-md border border-gray-300 object-cover"
                  />
                ) : (
                  <span className="flex h-12 w-12 items-center justify-center self-start rounded-md border border-gray-300">
                    {file.type.startsWith("image/") ? (
                      <ImageIcon className="h-5 w-5 text-gray-500" />
                    ) : (
                      <VideoIcon className="h-5 w-5 text-gray-500" />
                    )}
                  </span>
                )}
                <div className="flex flex-1 flex-col gap-1">
                  <p className="text-sm font-medium"> {file.name}</p>
                  <p className="text-xs text-gray-500">
                    {file.description}
                    <button
                      type="button"
                      className="ml-2 rounded p-1 text-gray-400 duration-200 hover:bg-gray-100 hover:text-gray-600"
                      title="Copy to clipboard"
                      onClick={() => {
                        navigator.clipboard.writeText("value");
                        toast.success("Copied to clipboard!", {
                          duration: 2000,
                        });
                      }}
                    >
                      <CopyIcon className="h-3 w-3" />
                    </button>
                  </p>
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

        {showAiResponse && (
          <div className="flex flex-col gap-2 rounded-md border border-gray-200 bg-white p-4">
            {Object.entries(AIGeneratedResponse).map(([key, value]) => (
              <div key={key} className="flex flex-col gap-1">
                <h5 className="font-medium">{key}</h5>
                <p className="text-sm text-gray-500">
                  {value}{" "}
                  <button
                    type="button"
                    className="ml-2 rounded-md p-1 text-gray-400 duration-200 hover:bg-gray-100 hover:text-gray-600"
                    title="Copy to clipboard"
                    onClick={() => {
                      navigator.clipboard.writeText(value);
                      toast.success("Copied to clipboard!", {
                        duration: 2000,
                      });
                    }}
                  >
                    <CopyIcon className="h-3.5 w-3.5" />
                  </button>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </ModalContainer>
  );
}
