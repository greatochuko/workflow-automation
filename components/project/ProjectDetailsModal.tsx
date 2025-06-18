import React, { useEffect, useMemo, useState } from "react";
import ModalContainer from "../ui/ModalContainer";
import { ProjectType } from "@/types/project";
import {
  CirclePlayIcon,
  ClipboardListIcon,
  CopyIcon,
  EditIcon,
  LoaderIcon,
  SaveIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import { getEventColorClass } from "./CalendarDayCell";
import { toast } from "sonner";
import { isBefore, startOfDay } from "date-fns";
import DeleteProjectModal from "./DeleteProjectModal";
import {
  updateProjectDate,
  updateProjectDescription,
} from "@/actions/projectActions";
import ProjectThumbnail from "./ProjectThumbnail";
import DatePicker from "../ui/DatePicker";
import Button from "../ui/Button";
import ProjectMediaPreviewModal from "./ProjectMediaPreviewModal";
import ClientSOPModal from "./ClientSOPModal";

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
  closeModal: closeProjectDetailsModal,
  project: initialProject,
  showAiResponse = false,
  isClientProject = false,
  removeFromProjectList,
  updateProjectList,
}: {
  open: boolean;
  closeModal: () => void;
  project: ProjectType | null;
  showAiResponse?: boolean;
  isClientProject?: boolean;
  removeFromProjectList(deletedProjectId: string): void;
  updateProjectList(updatedProject: ProjectType): void;
}) {
  const [project, setProject] = useState(initialProject);
  const [loading, setLoading] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);
  const [canEditProject, setCanEditProject] = useState(false);
  const [SOPModalOpen, setSOPModalOpen] = useState(false);
  const [deleteProjectModalOpen, setDeleteProjectModalOpen] = useState(false);
  const [descriptionInput, setDescriptionInput] = useState(
    project?.description || "",
  );
  const [date, setDate] = useState<Date | null>(project?.scheduledDate || null);
  const [mediaToPreview, setMediaToPreview] = useState<{
    type: string;
    url: string;
  } | null>(null);

  useEffect(() => {
    if (initialProject) {
      setProject(initialProject);
    }
  }, [initialProject]);

  const isBeforeToday = project?.scheduledDate
    ? isBefore(project.scheduledDate, startOfDay(new Date()))
    : true;

  const sortedCaptionData = useMemo(
    () =>
      project?.captionData
        ? Object.entries(project.captionData).sort(([a], [b]) => {
            const order = ["hook", "cta1", "cta2", "captionContent"];
            return order.indexOf(a) - order.indexOf(b);
          })
        : [],
    [project?.captionData],
  );

  function cancelEditing() {
    setCanEditProject(false);
    setDescriptionInput(project?.description || "");
  }

  function startEditing() {
    setDescriptionInput(project?.description || "");
    setCanEditProject(true);
  }

  function closeModal() {
    setDeleteProjectModalOpen(false);
    setLoading(false);
    setCanEditProject(false);
    closeProjectDetailsModal();
  }

  async function handleSaveDescription() {
    setLoading(true);
    if (!project) return;
    const { data } = await updateProjectDescription(
      project.id,
      descriptionInput,
    );
    if (data) {
      setProject(data);
      setCanEditProject(false);
    }
    setLoading(false);
  }

  async function handleRescheduleProject() {
    if (project && date) {
      setRescheduling(true);
      const { data } = await updateProjectDate(project.id, date);
      if (data) {
        updateProjectList({ ...project, scheduledDate: date });
        toast.success("Project rescheduled successfully!");
      } else {
        toast.error("Unable to reschedule project!");
      }
      setRescheduling(false);
    }
  }

  function handleChangePublishTime(event: React.ChangeEvent<HTMLInputElement>) {
    const timeValue = event.target.value;
    if (!timeValue) return;
    if (!date) return;

    const [hours, minutes] = timeValue.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return;
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    setDate(newDate);
  }

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
          <Button
            onClick={() => setSOPModalOpen(true)}
            variant="outline"
            className="hover:bg-accent w-fit duration-150 hover:text-white"
          >
            <ClipboardListIcon size={16} /> Client SOP
          </Button>
          {!isBeforeToday && (
            <div className="flex items-center gap-4">
              {canEditProject ? (
                <>
                  <button
                    onClick={cancelEditing}
                    className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium duration-200 hover:bg-gray-200"
                  >
                    <XIcon className="h-4 w-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveDescription}
                    disabled={loading}
                    className="text-accent disabled:bg-accent/10 border-accent/20 hover:bg-accent/10 flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium duration-200"
                  >
                    {loading ? (
                      <>
                        <LoaderIcon className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <SaveIcon className="h-4 w-4" />
                        Save
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={startEditing}
                  className="text-accent border-accent/20 hover:bg-accent/10 flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium duration-200"
                >
                  <EditIcon className="h-4 w-4" />
                  Edit
                </button>
              )}
              {isClientProject && (
                <button
                  onClick={() => setDeleteProjectModalOpen(true)}
                  className="text-accent-red border-accent-red/20 ml-auto flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium duration-200 hover:bg-red-100"
                >
                  <TrashIcon className="h-4 w-4" />
                  Delete
                </button>
              )}
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

          <div className="flex flex-col gap-2 text-sm">
            <label htmlFor="description" className="font-medium">
              Reschedule Project
            </label>
            <div className="flex flex-col gap-2 text-sm sm:flex-row">
              <div className="flex flex-1 flex-wrap gap-2.5 text-sm sm:gap-4">
                <DatePicker
                  className="ring-accent-black/70 min-w-36 flex-1 px-3 ring-offset-1 duration-200 focus-visible:ring-2 sm:px-4"
                  date={date}
                  onChange={setDate}
                  position="bottom"
                  closeAfterSelection
                  containerClassname="flex-1"
                />

                <input
                  type="time"
                  name="target-publish-time"
                  id="target-publish-time"
                  value={
                    date
                      ? `${date.getHours().toString().padStart(2, "0")}:${date
                          .getMinutes()
                          .toString()
                          .padStart(2, "0")}`
                      : "12:00"
                  }
                  onChange={handleChangePublishTime}
                  className="ring-accent-black/70 bg-background flex-1 rounded-md border border-gray-300 px-3 py-2 ring-offset-1 duration-200 focus-visible:ring-2 sm:px-4"
                />
              </div>
              <Button disabled={rescheduling} onClick={handleRescheduleProject}>
                {rescheduling ? (
                  <>
                    <LoaderIcon className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <SaveIcon className="h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            {canEditProject ? (
              <>
                <label htmlFor="description" className="font-medium">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  value={descriptionInput}
                  onChange={(e) => setDescriptionInput(e.target.value)}
                  className="bg-background resize-none rounded-md border border-gray-300 p-2 px-3 text-sm"
                />
              </>
            ) : (
              <>
                <h4 className="font-medium">Description</h4>
                <p className="text-sm text-gray-500">{project?.description}</p>
              </>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <h4 className="font-medium">Video Type</h4>
            <p className="text-sm text-gray-500">{project?.videoType}</p>
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
          {(project?.status === "SUBMITTED" ||
            project?.status === "APPROVED") && (
            <div className="flex flex-col gap-2">
              <h4 className="font-medium">Completed Project File</h4>
              <li
                key={project.completedFile.id}
                className="flex items-center gap-2 rounded-md border border-gray-200 bg-white p-2"
              >
                <ProjectThumbnail type="small" file={project.completedFile} />

                <p className="flex-1 text-sm font-medium">
                  {project.completedFile.name}
                </p>
                {/* <Link
                  href={project.completedFile.url || ""}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Download File"
                  className="hover:text-accent p-2 text-gray-500 duration-200"
                  download={project.completedFile.name}
                >
                  <CirclePlayIcon className="h-5 w-5" />
                </Link> */}
                <button
                  onClick={() =>
                    setMediaToPreview({
                      type: project.completedFile.type,
                      url: project.completedFile.url,
                    })
                  }
                  className="hover:text-accent p-2 text-gray-500 duration-200"
                >
                  <CirclePlayIcon className="h-5 w-5" />
                </button>
              </li>
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
                  <ProjectThumbnail type="small" file={file} />
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
                  {/* <Link
                    href={file.url || ""}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Download File"
                    className="hover:text-accent p-2 text-gray-500 duration-200"
                    download={file.name}
                  >
                    <CirclePlayIcon className="h-5 w-5" />
                  </Link> */}
                  <button
                    onClick={() =>
                      setMediaToPreview({
                        type: file.type,
                        url: file.url,
                      })
                    }
                    className="hover:text-accent p-2 text-gray-500 duration-200"
                  >
                    <CirclePlayIcon className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {showAiResponse && project?.captionData && (
            <div className="flex flex-col gap-2 rounded-md border border-gray-200 bg-white p-4">
              {sortedCaptionData.map(([key, value]) => (
                <div key={key} className="flex flex-col gap-1">
                  <h5 className="font-medium">{getResponseLabel(key)}</h5>
                  <p className="text-sm text-gray-500">
                    {value.split("\n").map((line, idx, arr) => (
                      <React.Fragment key={idx}>
                        {line}
                        {idx < arr.length - 1 ? <br /> : null}
                      </React.Fragment>
                    ))}
                    <button
                      type="button"
                      className="ml-2 inline-flex items-center gap-2 rounded-full border border-gray-300 p-1 px-2 py-1 text-xs text-gray-400 duration-200 hover:bg-gray-100 hover:text-gray-600"
                      title="Copy to clipboard"
                      onClick={() => {
                        navigator.clipboard.writeText(value);
                        toast.success("Copied to clipboard!", {
                          duration: 2000,
                        });
                      }}
                    >
                      <CopyIcon className="h-3.5 w-3.5" />
                      Copy
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

      <ProjectMediaPreviewModal
        open={!!mediaToPreview}
        closeModal={() => setMediaToPreview(null)}
        media={mediaToPreview}
      />

      <ClientSOPModal
        open={SOPModalOpen}
        closeModal={() => setSOPModalOpen(false)}
        SOPChecklist={project?.createdBy.SOPSettings || []}
      />
    </>
  );
}
