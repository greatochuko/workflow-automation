import React, { useState } from "react";
import ModalContainer from "../ui/ModalContainer";
import Select from "../ui/Select";
import { FileUploadZone } from "./FileUploadZone";
import { FileWithPreview } from "@/types/video";
import { VideoCarousel } from "./VideoCarousel";
import { LoaderIcon, TriangleAlertIcon, XIcon } from "lucide-react";
import DatePicker from "../ui/DatePicker";
import Button from "../ui/Button";
import { toast } from "sonner";
import { createProject } from "@/actions/projectActions";
import { ProjectFileType, ProjectType } from "@/types/project";
import { generateVideoThumbnail } from "@/lib/utils/videoThumbnailGenerator";
import { resizeImage } from "@/lib/utils/imageResize";
import { uploadFileWithProgress } from "@/lib/utils/fileUpload";
import { VideoScriptType } from "@/types/videoScript";

const MAX_NUMBER_OF_FILES = 5;

export default function ProjectCreationModal({
  open,
  closeModal: closeVideoModal,
  videoTypes,
  videoScripts,
  updateProjects,
}: {
  open: boolean;
  closeModal: () => void;
  videoTypes: string[];
  videoScripts: VideoScriptType[];
  updateProjects: (project: ProjectType) => void;
}) {
  const [videoType, setVideoType] = useState("");
  const [videoScriptId, setVideoScriptId] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(true);
  const [error, setError] = useState("");
  const [selectingFiles, setSelectingFiles] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {},
  );

  const uploadPercentage =
    Object.keys(uploadProgress).length > 0
      ? Math.round(
          (Object.values(uploadProgress).reduce((a, b) => a + b, 0) /
            (Object.values(uploadProgress).length * 100)) *
            100,
        )
      : 0;

  function closeModal() {
    setUploadedFiles([]);
    setTitle("");
    setDescription("");
    setDate(null);
    setError("");
    setLoading(false);
    setUploading(true);
    setVideoType("");
    closeVideoModal();
    setUploadProgress({});
  }

  async function handleFiles(files: FileList) {
    if (uploadedFiles.length + files.length > MAX_NUMBER_OF_FILES) {
      toast.error(`You can only upload up to ${MAX_NUMBER_OF_FILES} files.`);
      return;
    }

    const validFiles = Array.from(files).filter(
      (file) =>
        file.type.startsWith("video/") || file.type.startsWith("image/"),
    );

    if (validFiles.length !== files.length) {
      toast.error("Only video and image files are allowed.");
      return;
    }

    setSelectingFiles(true);
    const newFiles = await Promise.all(
      validFiles.map(async (file) => {
        const isVideoFile = file.type.startsWith("video/");
        let previewFile;
        let previewUrl;
        if (isVideoFile) {
          const { data } = await generateVideoThumbnail(file, 480);
          previewFile = data?.file;
          previewUrl = data?.url || "";
        } else {
          const { dataUrl, resizedFile } = await resizeImage(file, 320);
          previewFile = resizedFile;
          previewUrl = dataUrl || "";
        }

        const id = `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        return {
          file,
          metadata: {
            id,
            description: "",
            previewUrl,
            previewFile,
          },
        };
      }),
    );
    setSelectingFiles(false);

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  }

  function updateMetadata(
    id: string,
    field: "title" | "description",
    value: string,
  ) {
    setUploadedFiles((prev) =>
      prev.map((file) =>
        file.metadata.id === id
          ? { ...file, metadata: { ...file.metadata, [field]: value } }
          : file,
      ),
    );
  }

  function removeFile(id: string) {
    setUploadedFiles((prev) => prev.filter((file) => file.metadata.id !== id));
  }

  function handleChangeVideoScriptId(value: string) {
    setVideoScriptId(value);
    const selectedVideoScript = videoScripts.find((vs) => vs.id === value);
    if (selectedVideoScript) {
      setTitle(selectedVideoScript.topic);
      setDescription(
        `${selectedVideoScript.content.hookLine}\n\n${selectedVideoScript.content.body}\n\n${selectedVideoScript.content.cta} `,
      );
    }
  }

  function handleChangePublishTime(event: React.ChangeEvent<HTMLInputElement>) {
    const timeValue = event.target.value;
    if (!timeValue) return;
    if (!date) {
      setError("Please select a date first.");
      return;
    }
    const [hours, minutes] = timeValue.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return;
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    setDate(newDate);
  }

  // async function uploadFile(file: File) {
  //   const { url, key } = await getPresignedUrl(file.type);

  //   if (!key) {
  //     return key;
  //   }

  //   try {
  //     const res = await fetch(url, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": file.type,
  //       },
  //       body: file,
  //     });

  //     if (!res.ok) {
  //       throw new Error("Upload failed");
  //     }

  //     return key;
  //   } catch {
  //     return null;
  //   }
  // }

  async function handleSubmit() {
    setError("");
    if (uploadedFiles.length === 0) {
      setError("Please upload at least one video or image file.");
      return;
    }
    if (!title) {
      setError("Title is required");
      return;
    } else if (!description) {
      setError("Description is required");
      return;
    } else if (!date) {
      setError("Target publish date is required");
      return;
    } else if (!videoType) {
      setError("Video type is required");
      return;
    }

    setLoading(true);
    setUploading(true);

    const projectFiles: ProjectFileType[] = [];

    const uploadedResults = await Promise.all(
      uploadedFiles.map(async (file) => {
        const url = await uploadFileWithProgress(file.file, (progress, key) => {
          setUploadProgress((prev) => ({ ...prev, [key]: progress }));
        });
        const thumbnailUrl =
          (file.metadata.previewFile
            ? await uploadFileWithProgress(
                file.metadata.previewFile,
                (progress, key) => {
                  setUploadProgress((prev) => ({ ...prev, [key]: progress }));
                },
              )
            : "") || "";

        if (url) {
          return {
            id: file.metadata.id,
            name: file.file.name,
            description: file.metadata.description,
            url,
            thumbnailUrl,
            type: file.file.type,
          } as ProjectFileType;
        }
        return null;
      }),
    );

    for (const result of uploadedResults) {
      if (result) {
        projectFiles.push(result);
      }
    }
    setUploading(false);

    const projectData = {
      title: title,
      description: description,
      scheduledDate: date,
      videoType: videoType,
      files: projectFiles,
    };

    const { data, error } = await createProject(
      projectData,
      videoScripts.find((script) => script.id === videoScriptId),
    );

    if (data) {
      updateProjects(data as ProjectType);
      toast.success("Project created successfully!");
      setVideoType("");
      closeModal();
    } else {
      toast.error(error);
    }

    setUploadProgress({});
    setLoading(false);
  }

  return (
    <ModalContainer open={open} closeModal={closeModal}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`mx-auto flex max-h-[85vh] w-9/10 max-w-4xl flex-col overflow-hidden rounded-md bg-white ${open ? "" : "scale-105"}`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between bg-white p-4 pb-2 shadow-xs sm:p-6 sm:pb-3">
          <h3 className="font-semibold sm:text-lg">Upload Videos & Photos</h3>
          <button
            onClick={closeModal}
            className="hover:text-foreground p-1 text-gray-500 duration-200"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4 pt-2 sm:p-6 sm:pt-3">
          <Select
            onChange={(value) => setVideoType(value)}
            value={videoType}
            options={videoTypes.map((vt) => ({
              label: <span>{vt}</span>,
              value: vt,
            }))}
            placeholder={
              <span>
                Select Video Type <span className="text-red-500">*</span>
              </span>
            }
            showCheckmark
          />

          <FileUploadZone
            maxFiles={MAX_NUMBER_OF_FILES}
            onFilesSelected={handleFiles}
            selectingFiles={selectingFiles}
          />

          {uploadedFiles.length > 0 && (
            <>
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-medium">
                  Uploaded Files ({uploadedFiles.length}/{MAX_NUMBER_OF_FILES})
                </h3>

                <VideoCarousel
                  files={uploadedFiles}
                  onRemove={removeFile}
                  onMetadataChange={updateMetadata}
                />
              </div>

              <div className="flex flex-col gap-2 text-sm">
                <label htmlFor="video-script" className="font-medium">
                  Script
                </label>
                <Select
                  onChange={handleChangeVideoScriptId}
                  value={videoScriptId}
                  options={videoScripts.map((vt) => ({
                    label: (
                      <span className="truncate overflow-hidden">
                        {vt.topic}
                      </span>
                    ),
                    value: vt.id,
                  }))}
                  placeholder={<span>Select Video Script (optional)</span>}
                  showCheckmark
                  dropdownClassname="w-full"
                />
              </div>

              <div className="flex flex-col gap-2 text-sm">
                <label htmlFor="title" className="font-medium">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title"
                  className="bg-background rounded-md border border-gray-300 p-2 px-3"
                />
              </div>

              <div className="flex flex-col gap-2 text-sm">
                <label htmlFor="description" className="font-medium">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={6}
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter a description"
                  className="bg-background resize-none rounded-md border border-gray-300 p-2 px-3"
                />
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex min-w-52 flex-1 flex-col gap-2">
                  <label htmlFor="target-publish-date" className="font-medium">
                    Target Publish Date <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    className="ring-accent-black/70 ring-offset-1 duration-200 focus-visible:ring-2"
                    date={date}
                    onChange={setDate}
                    closeAfterSelection
                  />
                </div>
                <div className="flex min-w-40 flex-1 flex-col gap-2">
                  <label htmlFor="target-publish-time" className="font-medium">
                    Target Publish Time <span className="text-red-500">*</span>
                  </label>
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
                    className="ring-accent-black/70 bg-background rounded-md border border-gray-300 px-4 py-2 ring-offset-1 duration-200 focus-visible:ring-2"
                  />
                </div>
              </div>

              {error && (
                <div className="flex w-fit items-center gap-2 rounded-md border border-red-500 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-500">
                  <TriangleAlertIcon className="h-3.5 w-3.5" />
                  {error}
                </div>
              )}
              <Button
                disabled={loading}
                onClick={handleSubmit}
                className="py-2.5"
              >
                {loading ? (
                  <>
                    <LoaderIcon className="h-4 w-4 animate-spin" />
                    {uploading
                      ? `Uploading Files...(${uploadPercentage}%)`
                      : "Submitting..."}
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </ModalContainer>
  );
}
