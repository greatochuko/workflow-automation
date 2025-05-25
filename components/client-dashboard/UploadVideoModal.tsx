import React, { useState } from "react";
import ModalContainer from "../ui/ModalContainer";
import Select from "../ui/Select";
import { FileUploadZone } from "./FileUploadZone";
import { FileWithPreview } from "@/types/video";
import { VideoCarousel } from "./VideoCarousel";
import { LoaderIcon, XIcon } from "lucide-react";
import DatePicker from "../ui/DatePicker";
import Button from "../ui/Button";
import { toast } from "sonner";
import { createProject } from "@/actions/projectActions";
import { ProjectType } from "@/types/project";

const MAX_NUMBER_OF_FILES = 5;

export default function UploadVideoModal({
  open,
  closeModal,
  videoTypes,
  updateProjects,
}: {
  open: boolean;
  closeModal: () => void;
  videoTypes: string[];
  updateProjects: (project: ProjectType) => void;
}) {
  const [videoType, setVideoType] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFiles = (files: FileList) => {
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

    const newFiles = validFiles.map((file) => {
      const id = `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const preview = URL.createObjectURL(file);

      return { file, metadata: { id, title: "", description: "", preview } };
    });

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

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

  const cannotSubmit =
    !title.trim() ||
    !description.trim() ||
    !date ||
    !uploadedFiles.length ||
    !videoType;

  async function handleSubmit() {
    if (cannotSubmit) return;
    setLoading(true);
    const { data, error } = await createProject({
      date,
      description,
      title,
      videoType,
      uploadedFiles: uploadedFiles,
    });
    if (data) {
      updateProjects(data as ProjectType);
      toast.success("Project created successfully!");
      setVideoType("");
      closeModal();
    } else {
      toast.error(error);
    }
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
            placeholder="Select Video Type"
            showCheckmark
          />
          <FileUploadZone
            maxFiles={MAX_NUMBER_OF_FILES}
            onFilesSelected={handleFiles}
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
                  rows={4}
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter a description"
                  className="bg-background resize-none rounded-md border border-gray-300 p-2 px-3"
                />
              </div>

              <div className="flex flex-col gap-2 text-sm">
                <label htmlFor="description" className="font-medium">
                  Target Publish Date <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  className="ring-accent-black/70 ring-offset-1 duration-200 focus-visible:ring-2"
                  date={date}
                  onChange={setDate}
                />
              </div>

              <Button
                disabled={cannotSubmit || loading}
                onClick={handleSubmit}
                className="py-2.5"
              >
                {loading ? (
                  <>
                    <LoaderIcon className="h-4 w-4 animate-spin" />
                    Submitting...
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
