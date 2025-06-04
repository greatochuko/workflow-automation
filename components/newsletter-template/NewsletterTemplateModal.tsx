import React, { useState } from "react";
import ModalContainer from "../ui/ModalContainer";
import Button from "../ui/Button";
import { toast } from "sonner";
import { LoaderIcon } from "lucide-react";
import { ProjectType } from "@/types/project";
import { NewsletterTemplateType } from "@/types/newsletter";

const dummyTemplate = `Subject: Product Demo - New Feature - Weekly Update

Hi [First Name],

Hope you're having a great week! I wanted to share something exciting with you.

What if you could save 5 hours every week with just one click?

🎥 Product Demo - New Feature

Walkthrough of our latest product feature.

See how our new feature transforms your workflow in just 60 seconds!

Try our new feature now - free for 14 days!

Best regards,
[Your Name]

P.S. Hi [Name],`;

export default function NewsletterTemplateModal({
  open,
  closeModal,
  project,
  addNewTemplateToProject,
  creditsUsed,
}: {
  open: boolean;
  closeModal: () => void;
  project?: ProjectType;
  addNewTemplateToProject(
    projectId: string,
    newNewsletterTemplate: NewsletterTemplateType,
  ): void;
  creditsUsed: number;
}) {
  const [loading, setLoading] = useState(false);

  function handleGenerateTemplate() {
    if (!project) return;
    setLoading(true);
    const newNewsletterTemplate = {
      id: new Date().toString(),
      clientId: "",
      content: dummyTemplate,
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
      projectId: project.id,
    } as NewsletterTemplateType;

    addNewTemplateToProject(project.id, newNewsletterTemplate);

    toast.success(
      "Newsletter template generated successfully! 1 credit has been used.",
    );
    setLoading(false);
  }
  return (
    <ModalContainer open={open} closeModal={closeModal}>
      <div className="flex w-[90%] max-w-lg flex-col gap-4 rounded-lg bg-white p-4 sm:p-6">
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
          Current usage: {creditsUsed}/2 credits
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
