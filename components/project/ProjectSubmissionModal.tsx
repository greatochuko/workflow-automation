import React, { useRef, useState } from "react";
import ModalContainer from "../ui/ModalContainer";
import { ProjectType } from "@/types/project";
import { CopyIcon, LoaderIcon, XIcon } from "lucide-react";
import Button from "../ui/Button";
import { toast } from "sonner";
import { submitProjectFiles } from "@/actions/projectActions";
import { uploadFileWithProgress } from "@/lib/utils/fileUpload";
import { generateVideoThumbnail } from "@/lib/utils/videoThumbnailGenerator";
import { resizeImage } from "@/lib/utils/imageResize";

const AIGeneratedResponse = {
  Hook: "Discover the magic of AI-generated content with our latest project!",
  "CTA 1":
    "Discover the magic of AI-generated content with our latest project!",
  "CTA 2":
    "Discover the magic of AI-generated content with our latest project!",
  "Caption Content":
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
};

export default function ProjectSubmissionModal({
  open,
  closeModal,
  project,
  updateProjectList,
}: {
  open: boolean;
  closeModal: () => void;
  project: ProjectType | null;
  updateProjectList(updatedProject: ProjectType): void;
}) {
  const [loading, setLoading] = useState(false);
  const [completedFile, setCompletedFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {},
  );
  const [uploading, setUploading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const uploadPercentage =
    Object.keys(uploadProgress).length > 0
      ? Math.round(
          (Object.values(uploadProgress).reduce((a, b) => a + b, 0) /
            (Object.values(uploadProgress).length * 100)) *
            100,
        )
      : 0;

  function closeModalHandler() {
    if (fileInputRef.current && fileInputRef.current.value) {
      fileInputRef.current.value = "";
    }
    setCompletedFile(null);
    closeModal();
  }

  type ReelsValidationResult = {
    valid: boolean;
    errors: string[];
  };

  async function validateReelsVideo(
    file: File,
  ): Promise<ReelsValidationResult> {
    const errors: string[] = [];

    if (
      !file.type.includes("mp4") &&
      !file.name.toLowerCase().endsWith(".mov")
    ) {
      errors.push("File must be in MP4 or MOV format.");
    }

    if (file.size > 300 * 1024 * 1024) {
      errors.push("Video file size must not exceed 300MB.");
    }

    const url = URL.createObjectURL(file);
    const video = document.createElement("video");

    return new Promise((resolve) => {
      video.preload = "metadata";
      video.src = url;

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(url);

        const { videoWidth, videoHeight, duration } = video;
        const aspectRatio = videoWidth / videoHeight;

        if (videoWidth > 1920) {
          errors.push("Video width must not exceed 1920 pixels.");
        }

        if (aspectRatio < 0.01 || aspectRatio > 10) {
          errors.push(
            "Aspect ratio must be between 0.01:1 and 10:1. Recommended: 9:16.",
          );
        }

        if (duration < 3 || duration > 900) {
          errors.push("Duration must be between 3 seconds and 15 minutes.");
        }

        resolve({ valid: errors.length === 0, errors });
      };

      video.onerror = () => {
        errors.push(
          "Unable to read video metadata. Ensure it's a valid MP4 or MOV file.",
        );
        resolve({ valid: false, errors });
      };
    });
  }

  async function handleChangeFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    setErrors([]);
    const { errors: validationErrors } = await validateReelsVideo(file);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setCompletedFile(file);
    const isVideoFile = file.type.startsWith("video/");

    if (isVideoFile) {
      const { data } = await generateVideoThumbnail(file, 480);
      setThumbnailFile(data?.file || null);
    } else {
      const { resizedFile } = await resizeImage(file, 320);
      setThumbnailFile(resizedFile || null);
    }
  }

  async function handleSubmission() {
    if (!project || !completedFile) return;
    setLoading(true);
    setUploading(true);

    const url = await uploadFileWithProgress(completedFile, (progress, key) => {
      setUploadProgress((prev) => ({ ...prev, [key]: progress }));
    });
    const thumbnailUrl = thumbnailFile
      ? await uploadFileWithProgress(thumbnailFile, (progress, key) => {
          setUploadProgress((prev) => ({ ...prev, [key]: progress }));
        })
      : "";

    setUploading(false);

    const { data } = await submitProjectFiles(project.id, {
      id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: completedFile.name,
      type: completedFile.type,
      url: url || "",
      thumbnailUrl: thumbnailUrl || "",
    });
    if (data) {
      updateProjectList(data);
      toast.success("Project submitted successfully!", {
        duration: 2000,
      });
      closeModalHandler();
    } else {
      toast.error("Failed to submit project. Please try again.", {
        duration: 2000,
      });
    }

    setLoading(false);
  }
  return (
    <ModalContainer open={open} closeModal={closeModalHandler}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-background flex max-h-[85%] w-[90%] max-w-xl flex-col gap-4 overflow-hidden overflow-y-auto rounded-md p-4 ${open ? "" : "scale-105"}`}
      >
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold sm:text-xl">
            Submit finished project
          </h4>
          <button
            onClick={closeModalHandler}
            className="hover:text-foreground p-2 text-gray-500 duration-200"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <h5 className="font-medium">{project?.title}</h5>
          <p className="text-sm text-gray-500">{project?.description}</p>
        </div>

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

        <input
          type="file"
          name="finished-project"
          id="finished-project"
          accept="video/*"
          ref={fileInputRef}
          onChange={handleChangeFile}
          className="cursor-pointer rounded-md border border-gray-200 p-1 text-sm file:cursor-pointer file:rounded-md file:border file:border-gray-200 file:bg-gray-100 file:p-2 file:duration-200 placeholder:text-gray-500 hover:file:bg-gray-200"
        />

        <div className="flex flex-col gap-2">
          {errors.map((error, i) => (
            <p key={i} className="text-accent-red text-xs">
              {error}
            </p>
          ))}
        </div>

        <Button
          disabled={loading || errors.length > 0}
          onClick={handleSubmission}
          className="self-end"
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
      </div>
    </ModalContainer>
  );
}
