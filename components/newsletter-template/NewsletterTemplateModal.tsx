import React, { useState } from "react";
import ModalContainer from "../ui/ModalContainer";
import Button from "../ui/Button";
import { toast } from "sonner";
import { LoaderIcon } from "lucide-react";
import { ProjectType } from "@/types/project";
import { NewsletterTemplateType } from "@/types/newsletter";
import { createNewsletterTemplate } from "@/actions/newsletterActions";

export default function NewsletterTemplateModal({
  open,
  closeModal,
  project,
  addNewTemplateToProject,
  creditsUsed,
  totalCredits,
}: {
  open: boolean;
  closeModal: () => void;
  project?: ProjectType;
  addNewTemplateToProject(
    projectId: string,
    newNewsletterTemplate: NewsletterTemplateType,
  ): void;
  creditsUsed: number;
  totalCredits: number;
}) {
  const [loading, setLoading] = useState(false);

  async function handleGenerateTemplate() {
    if (!project) return;
    setLoading(true);

    const { data: newTemplate, error } = await createNewsletterTemplate(
      project.id,
    );

    if (newTemplate) {
      addNewTemplateToProject(project.id, newTemplate);

      toast.success(
        "Newsletter template generated successfully! 1 credit has been used.",
      );
    } else {
      toast.error(error);
    }
    setLoading(false);
  }

  return (
    <ModalContainer open={open} closeModal={closeModal}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-[90%] max-w-lg flex-col gap-4 rounded-lg bg-white p-4 sm:p-6"
      >
        <h4 className="text-lg font-semibold">
          Confirm Newsletter Template Generation
        </h4>
        <p className="text-sm text-gray-500">
          This action will generate a newsletter template for &quot;
          {project?.title}&quot; and will consume 1 credit from your monthly
          allowance.
          <br />
          <br />
          You will have 2 free revisions available after the initial generation.
          <br />
          <br />
          Current usage: {creditsUsed}/{totalCredits} credits
        </p>
        <div className="flex items-center justify-end gap-4">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleGenerateTemplate} disabled={loading}>
            {loading ? (
              <>
                <LoaderIcon className="h-4 w-4 animate-spin" /> Generating...
              </>
            ) : (
              "Generate Template (Use 1 Credit)"
            )}
          </Button>
        </div>
      </div>
    </ModalContainer>
  );
}
