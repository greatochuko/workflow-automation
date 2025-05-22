import React, { useState } from "react";
import ModalContainer from "../ui/ModalContainer";
import Select from "../ui/Select";
import { FileUploadZone } from "./FileUploadZone";
import { NotificationBanner } from "./NotificationBanner";
import { FileWithPreview, MetadataRecord } from "@/types/video";
import { VideoCarousel } from "./VideoCarousel";
import { XIcon } from "lucide-react";
import DatePicker from "../ui/DatePicker";
import Button from "../ui/Button";

const MAX_NUMBER_OF_FILES = 5;

export default function UploadVideoModal({
  open,
  closeModal,
  videoTypes,
}: {
  open: boolean;
  closeModal: () => void;
  videoTypes: string[];
}) {
  const [videoType, setVideoType] = useState("");
  const [error, setError] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);
  const [metadata, setMetadata] = useState<MetadataRecord>({});
  const [date, setDate] = useState<Date | null>(null);

  const handleFiles = (files: FileList) => {
    if (uploadedFiles.length + files.length > MAX_NUMBER_OF_FILES) {
      setError(`You can only upload up to ${MAX_NUMBER_OF_FILES} files.`);
      return;
    }

    const validFiles = Array.from(files).filter(
      (file) =>
        file.type.startsWith("video/") || file.type.startsWith("image/"),
    );

    if (validFiles.length !== files.length) {
      setError("Only video and image files are allowed.");
      return;
    }

    const newFiles = validFiles.map((file) => {
      const id = `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const preview = URL.createObjectURL(file);

      // Initialize metadata for new file
      setMetadata((prev) => ({
        ...prev,
        [id]: { title: "", description: "" },
      }));

      return Object.assign(file, { id, preview }) as FileWithPreview;
    });

    setUploadedFiles((prev) => [...prev, ...newFiles]);
    setError("");
  };

  function updateMetadata(
    id: string,
    field: "title" | "description",
    value: string,
  ) {
    setMetadata((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  }

  function removeFile(id: string) {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
    setMetadata((prev) => {
      const newMetadata = { ...prev };
      delete newMetadata[id];
      return newMetadata;
    });
  }

  return (
    <ModalContainer open={open} closeModal={closeModal}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="mx-auto flex max-h-[85vh] w-9/10 max-w-4xl flex-col overflow-hidden rounded-md bg-white"
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
        <NotificationBanner
          message={error}
          onDismiss={() => setError("")}
          type="error"
        />
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-2 sm:p-6 sm:pt-3">
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
                  metadata={metadata}
                  onRemove={removeFile}
                  onMetadataChange={updateMetadata}
                />
              </div>

              <div className="flex flex-col gap-4 text-sm">
                <div className="flex flex-col gap-2">
                  <label htmlFor="title" className="font-medium">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Enter a title"
                    className="bg-background rounded-md border border-gray-300 p-2 px-3"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="description" className="font-medium">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    id="description"
                    name="description"
                    placeholder="Enter a description"
                    className="bg-background resize-none rounded-md border border-gray-300 p-2 px-3"
                  />
                </div>
                <DatePicker date={date} onChange={setDate} />
              </div>
              <Button className="py-2.5">Submit</Button>
            </>
          )}
        </div>
      </div>
    </ModalContainer>
  );
}
