import React, { useMemo, useState } from "react";
import ModalContainer from "../ui/ModalContainer";
import { ProjectType } from "@/types/project";
import {
  CloudDownloadIcon,
  CopyIcon,
  EditIcon,
  ImageIcon,
  TrashIcon,
  VideoIcon,
  XIcon,
} from "lucide-react";
import { getEventColorClass } from "./CalendarDayCell";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";
import { isBefore, startOfDay } from "date-fns";
import DeleteProjectModal from "./DeleteProjectModal";

// const AIGeneratedResponse = {
//   hook: "Unwinding tensions, one adjustment at a time! 🌀",
//   cta1: "Tag someone who could use a little relief. 🙌",
//   cta2: "Follow for more wellness tips! 🌿",
//   captionContent:
//     "Watch as we work our magic to bring back that feel-good vibe to your day. 👐💫\n" +
//     "\n" +
//     "Don't ignore your body's whispers; let's keep your spine in line and your life in balance.\n" +
//     "\n" +
//     "📸: [@chiropractic_clinic_handle]\n" +
//     "\n" +
//     "#ChiropracticCare #BackPainRelief #WellnessJourney",
// };

function getResponseLabel(key: string) {
  switch (key) {
    case "hook":
      return "Hook";

    case "cta1":
      return "CTA #1";

    case "cta2":
      return "CTA #2";

    case "captionContent":
      return "Caption Content";

    default:
      break;
  }
}

export default function ProjectDetailsModal({
  open,
  closeModal,
  project,
  showAiResponse = false,
  isClientProject = false,
  removeFromProjectList,
}: {
  open: boolean;
  closeModal: () => void;
  project: ProjectType | null;
  showAiResponse?: boolean;
  isClientProject?: boolean;
  removeFromProjectList(deletedProjectId: string): void;
}) {
  const [canEditProject, setCanEditProject] = useState(false);
  const [deleteProjectModalOpen, setDeleteProjectModalOpen] = useState(false);

  const isBeforeToday = project?.scheduledDate
    ? isBefore(project.scheduledDate, startOfDay(new Date()))
    : true;

  const sortedEntries = useMemo(
    () =>
      project?.captionData
        ? Object.entries(project.captionData).sort(([a], [b]) => {
            const order = ["hook", "cta1", "cta2", "captionContent"];
            return order.indexOf(a) - order.indexOf(b);
          })
        : [],
    [project?.captionData],
  );

  return (
    <>
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
          {isClientProject && !isBeforeToday && (
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCanEditProject(true)}
                className="text-accent border-accent/20 hover:bg-accent/10 flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium duration-200"
              >
                <EditIcon className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={() => setDeleteProjectModalOpen(true)}
                className="text-accent-red border-accent-red/20 flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium duration-200 hover:bg-red-100"
              >
                <TrashIcon className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
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
              {project?.status
                ? project.status
                    .replace("_", " ")
                    .toLowerCase()
                    .replace(/^\w/, (c) => c.toUpperCase())
                : "No status"}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <h4 className="font-medium">Description</h4>
            <p className="text-sm text-gray-500">{project?.description}</p>
          </div>

          {(project?.status === "APPROVED" ||
            project?.status === "REJECTED") && (
            <div className="flex flex-col gap-1">
              <h4 className="font-medium">Feedback</h4>
              <p
                className={`rounded-md text-sm ${project?.feedback ? (project?.status === "REJECTED" ? "border border-red-200 bg-red-50 p-2 text-red-600" : "border border-emerald-200 bg-emerald-50 p-2 text-emerald-600") : "text-gray-500"}`}
              >
                {project?.feedback || "No feedback provided"}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <h4 className="font-medium">Project Files</h4>
            <ul className="flex flex-col gap-2">
              {project?.files.map((file) => (
                <li
                  key={file.id}
                  className="flex items-center gap-2 rounded-md border border-gray-200 bg-white p-2"
                >
                  {file.thumbnailUrl?.startsWith("/") ||
                  file.thumbnailUrl?.startsWith("http") ? (
                    <Image
                      src={file.thumbnailUrl}
                      alt={file.name}
                      width={96}
                      height={96}
                      className="aspect-video w-24 rounded-md border border-gray-300 object-cover"
                    />
                  ) : (
                    <span className="flex aspect-video w-24 items-center justify-center self-start rounded-md border border-gray-300">
                      {file.type.startsWith("image/") ? (
                        <ImageIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <VideoIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </span>
                  )}
                  <div className="flex flex-1 flex-col gap-1">
                    <p className="text-sm font-medium"> {file.name}</p>
                    {file.description && (
                      <p className="text-xs text-gray-500">
                        {file.description}
                        <button
                          type="button"
                          className="ml-2 rounded p-1 text-gray-400 duration-200 hover:bg-gray-100 hover:text-gray-600"
                          title="Copy to clipboard"
                          onClick={() => {
                            navigator.clipboard.writeText(file.description);
                            toast.success("Copied to clipboard!", {
                              duration: 2000,
                            });
                          }}
                        >
                          <CopyIcon className="h-3 w-3" />
                        </button>
                      </p>
                    )}
                  </div>
                  <Link
                    href={file.url || ""}
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

          {showAiResponse && project?.captionData && (
            <div className="flex flex-col gap-2 rounded-md border border-gray-200 bg-white p-4">
              {sortedEntries.map(([key, value]) => (
                <div key={key} className="flex flex-col gap-1">
                  <h5 className="font-medium">{getResponseLabel(key)}</h5>
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

      <DeleteProjectModal
        open={deleteProjectModalOpen}
        closeModal={() => setDeleteProjectModalOpen(false)}
        closeParentModal={closeModal}
        projectId={project?.id}
        projectTitle={project?.title}
        removeFromProjectList={removeFromProjectList}
      />
    </>
  );
}
