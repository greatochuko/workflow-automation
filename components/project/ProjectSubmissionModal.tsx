import React, { useRef, useState } from "react";
import ModalContainer from "../ui/ModalContainer";
import { ProjectType } from "@/types/project";
import { CopyIcon, XIcon } from "lucide-react";
import Button from "../ui/Button";
import { toast } from "sonner";
import { submitProjectFiles } from "@/actions/projectActions";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  function closeModalHandler() {
    if (fileInputRef.current && fileInputRef.current.value) {
      fileInputRef.current.value = "";
    }
    setCompletedFile(null);
    closeModal();
  }

  async function handleSubmission() {
    if (!project || !completedFile) return;
    setLoading(true);

    const { data } = await submitProjectFiles(project.id, {
      id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: completedFile.name,
      type: completedFile.type,
      url: "",
      thumbnailUrl: "",
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
          accept="video/*,image/*"
          ref={fileInputRef}
          onChange={(e) => setCompletedFile(e.target.files?.[0] ?? null)}
          className="cursor-pointer rounded-md border border-gray-200 p-1 text-sm file:cursor-pointer file:rounded-md file:border file:border-gray-200 file:bg-gray-100 file:p-2 file:duration-200 placeholder:text-gray-500 hover:file:bg-gray-200"
        />

        <Button
          disabled={loading}
          onClick={handleSubmission}
          className="self-end"
        >
          Submit
        </Button>
      </div>
    </ModalContainer>
  );
}
