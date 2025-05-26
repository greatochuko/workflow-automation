import React, { useState } from "react";
import ModalContainer from "../ui/ModalContainer";
import { ProjectType } from "@/types/project";
import { XIcon } from "lucide-react";

export default function RejectProjectModal({
  open,
  closeModal,
  project,
}: {
  open: boolean;
  closeModal: () => void;
  project: ProjectType | null;
}) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!project || !feedback.trim()) return;

    setLoading(true);
    setLoading(false);
  }

  return (
    <ModalContainer open={open} closeModal={closeModal}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="flex w-[90%] max-w-lg flex-col gap-6 rounded-md bg-white p-4"
      >
        <div className="">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold">Reject Video</h4>
            <button
              type="button"
              onClick={closeModal}
              className="hover:text-foreground p-2 text-gray-500 duration-200"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-gray-500">
            Please provide detailed feedback explaining why this video requires
            amendments.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <label htmlFor="feedback" className="font-medium">
            Feedback <span className="text-red-500">*</span>
          </label>
          <textarea
            name="feedback"
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Please explain what needs to be fixed"
            rows={4}
            className="resize-none rounded-md border border-gray-300 px-3 py-2"
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
            className="bg-accent-red hover:bg-accent-red/90 disabled:bg-accent-red/50 cursor-pointer rounded-md px-4 py-2 text-sm font-medium text-white duration-200"
            disabled={loading || !feedback.trim()}
          >
            Submit Feedback
          </button>
        </div>
      </form>
    </ModalContainer>
  );
}
