import React, { useState } from "react";
import ModalContainer from "../ui/ModalContainer";
import { ProjectType } from "@/types/project";
import { XIcon } from "lucide-react";
import { approveProject, rejectProject } from "@/actions/projectActions";
import { toast } from "sonner";

export default function ProjectActionModal({
  open,
  closeModal,
  projectId,
  actionType,
  updateProjectList,
}: {
  open: boolean;
  closeModal: () => void;
  projectId: string;
  actionType: "approve" | "reject" | "";
  updateProjectList: (updatedProject: ProjectType) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!projectId || (actionType === "reject" && !feedback.trim())) return;

    setLoading(true);
    let result;
    if (actionType === "reject") {
      result = await rejectProject(projectId, feedback.trim());
    } else {
      result = await approveProject(projectId, feedback.trim());
    }
    if (result.data) {
      closeModal();
      setFeedback("");
      updateProjectList(result.data);
    } else {
      toast.error(`Failed to ${actionType} project. Please try again.`);
    }
    setLoading(false);
  }

  return (
    <ModalContainer open={open} closeModal={closeModal}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="flex w-[90%] max-w-lg flex-col gap-6 rounded-md bg-white p-4"
      >
        <div>
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold">
              {actionType === "reject" ? "Reject Video" : "Approve Video"}
            </h4>
            <button
              type="button"
              onClick={closeModal}
              className="hover:text-foreground p-2 text-gray-500 duration-200"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-gray-500">
            {actionType === "reject"
              ? "Please provide detailed feedback explaining why this video requires amendments."
              : "You can provide optional feedback for approval."}
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <label htmlFor="feedback" className="font-medium">
            Feedback
            {actionType === "reject" && <span className="text-red-500">*</span>}
          </label>
          <textarea
            name="feedback"
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder={
              actionType === "reject"
                ? "Please explain what needs to be fixed"
                : "Optional feedback"
            }
            rows={4}
            className="resize-none rounded-md border border-gray-300 px-3 py-2"
            required={actionType === "reject"}
          ></textarea>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={closeModal}
            className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium duration-200 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`${
              actionType === "reject"
                ? "bg-accent-red hover:bg-accent-red/90 disabled:bg-accent-red/50"
                : "bg-emerald-600 hover:bg-emerald-600/90 disabled:bg-emerald-600/50"
            } cursor-pointer rounded-md px-4 py-2 text-sm font-medium text-white duration-200`}
            disabled={loading || (actionType === "reject" && !feedback.trim())}
          >
            {loading
              ? actionType === "reject"
                ? "Submitting..."
                : "Approving..."
              : actionType === "reject"
                ? "Submit Feedback"
                : "Approve"}
          </button>
        </div>
      </form>
    </ModalContainer>
  );
}
