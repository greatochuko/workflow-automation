"use client";

import { ProjectType } from "@/types/project";
import React, { useMemo, useState } from "react";
import ProjectThumbnail from "../project/ProjectThumbnail";
import { format } from "date-fns";
import Button from "../ui/Button";
import { CopyIcon, FileTextIcon, InfoIcon, RefreshCwIcon } from "lucide-react";
import NewsletterTemplateModal from "./NewsletterTemplateModal";
import { toast } from "sonner";
import ToggleSidebarButton from "../sidebar/ToggleSidebarButton";
import { NewsletterTemplateType } from "@/types/newsletter";
import { createNewsletterTemplate } from "@/actions/newsletterActions";

export default function ClientNewsletterTemplatePageContent({
  projects,
  creditsUsedThisMonth,
  totalCredits,
}: {
  projects: ProjectType[];
  creditsUsedThisMonth: number;
  totalCredits: number;
}) {
  const [projectList, setProjectList] = useState(projects);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [revising, setRevising] = useState(false);
  const [creditsUsed, setCreditsUsed] = useState(creditsUsedThisMonth);

  const selectedProject = useMemo(
    () => projectList.find((prj) => prj.id === selectedProjectId),
    [projectList, selectedProjectId],
  );

  const projectNewsLetters = useMemo(
    () => selectedProject?.newsletterTemplates || [],
    [selectedProject?.newsletterTemplates],
  );

  const [selectedRevisionId, setSelectedRevisionId] = useState(
    projectNewsLetters[0]?.id,
  );

  const selectedRevision = useMemo(
    () => projectNewsLetters.find((pn) => pn.id === selectedRevisionId),
    [projectNewsLetters, selectedRevisionId],
  );

  function selectProject(projectId: string) {
    setSelectedProjectId(projectId);
    const project = projectList.find((prj) => prj.id === projectId);
    const projectNewsLetters = project?.newsletterTemplates || [];
    setSelectedRevisionId(projectNewsLetters[0]?.id);
  }

  async function handleReviseNewsletter() {
    setRevising(true);

    const { data: newTemplate, error } = await createNewsletterTemplate(
      selectedProjectId,
      projectNewsLetters.at(-1)?.content,
    );

    if (newTemplate) {
      addNewTemplateToProject(selectedProjectId, newTemplate);
      if (projectNewsLetters.length < 3) {
        toast.success("New revision generated");
      } else {
        toast.success(
          "Final revision generated! No additional credits used for revisions.",
        );
      }
    } else {
      toast.error(error);
    }
    setRevising(false);
  }

  function handleCopyNewsletter() {
    if (selectedRevision) {
      navigator.clipboard.writeText(selectedRevision.content);
      toast.success("Template copied to clipboard");
    }
  }

  function addNewTemplateToProject(
    projectId: string,
    newNewsletterTemplate: NewsletterTemplateType,
  ) {
    if (projectNewsLetters.length < 1) {
      setCreditsUsed((prev) => prev + 1);
    }
    setProjectList((prev) =>
      prev.map((prj) =>
        prj.id === projectId
          ? {
              ...prj,
              newsletterTemplates: [
                ...prj.newsletterTemplates,
                newNewsletterTemplate,
              ],
            }
          : prj,
      ),
    );
    setSelectedRevisionId(newNewsletterTemplate.id);
  }

  return (
    <>
      <main className="flex w-full flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-[5%] py-4">
          <div className="flex flex-col">
            <h1 className="flex items-center text-lg font-bold capitalize sm:text-xl md:text-2xl xl:text-[28px]">
              <ToggleSidebarButton />
              Newsletter Template Generator
            </h1>
            <p className="text-sm text-gray-500">
              Generate email newsletter templates from your approved videos
            </p>
          </div>
          <span className="bg-accent-black rounded-full px-2 py-1 text-xs font-semibold text-white">
            {creditsUsed}/{totalCredits} Credits Used
          </span>
        </div>

        <div className="mx-auto flex w-[90%] max-w-7xl flex-1 flex-col gap-6 py-4 lg:max-h-[calc(100vh-6rem)] lg:flex-row lg:overflow-y-auto">
          <div className="flex max-h-[calc(100vh-10rem)] flex-col gap-4 rounded-md border border-gray-200 bg-white p-4 sm:p-6 lg:h-auto lg:flex-1">
            <h2 className="font-semibold sm:text-lg md:text-xl xl:text-2xl">
              Select Approved Video
            </h2>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
              {projectList.map((project) => (
                <div
                  key={project.id}
                  onClick={() => selectProject(project.id)}
                  className={`flex cursor-pointer items-start gap-2 rounded-lg border border-gray-200 p-2 duration-200 hover:border-gray-500 ${selectedProject?.id === project.id ? "bg-background border-gray-700" : ""}`}
                >
                  <ProjectThumbnail file={project.files[0]} type="newsletter" />
                  <div className="flex flex-col">
                    <h4 className="text-sm font-medium">{project.title}</h4>
                    <p className="text-xs text-gray-500">{project.videoType}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(project.scheduledDate), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {creditsUsed < totalCredits ? (
              <Button
                onClick={() => setModalIsOpen(true)}
                disabled={
                  !selectedProject ||
                  selectedProject.newsletterTemplates.length > 0 ||
                  creditsUsed >= totalCredits
                }
              >
                <FileTextIcon className="h-4 w-4" /> Generate Newsletter
                Template
              </Button>
            ) : (
              <span className="bg-accent-red/10 border-accent-red/20 text-accent-red flex items-center justify-center gap-2 rounded-md border p-2 text-center text-sm">
                <InfoIcon className="h-4 w-4" />
                You have used up all your credits
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-4 rounded-md border border-gray-200 bg-white p-4 sm:p-6">
            {projectNewsLetters.length > 0 ? (
              <div className="flex flex-col gap-4 overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h2 className="font-semibold whitespace-nowrap sm:text-lg md:text-xl xl:text-2xl">
                    Newsletter Template
                  </h2>
                  <div className="flex gap-4">
                    <Button
                      onClick={handleReviseNewsletter}
                      variant="outline"
                      className="hover:bg-accent bg-gray-50 hover:text-white disabled:pointer-events-none disabled:text-gray-500"
                      disabled={revising || projectNewsLetters.length >= 3}
                    >
                      <RefreshCwIcon
                        className={`h-4 w-4 ${revising ? "animate-spin" : ""}`}
                      />
                      Revise ({3 - projectNewsLetters.length} left)
                    </Button>
                    <Button onClick={handleCopyNewsletter}>
                      <CopyIcon className="h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  {projectNewsLetters.map((newsletter, i) => (
                    <Button
                      key={newsletter.id}
                      variant={
                        selectedRevision?.id === newsletter.id
                          ? "default"
                          : "outline"
                      }
                      onClick={() => setSelectedRevisionId(newsletter.id)}
                      className={
                        selectedRevision?.id === newsletter.id
                          ? undefined
                          : "hover:bg-accent bg-gray-50 hover:text-white"
                      }
                    >
                      {i === 0 ? "Original" : `Revision ${i}`}
                    </Button>
                  ))}
                </div>

                <p className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                  💡 This template has used 1 credit. Revisions are free!
                </p>

                <div className="bg-background flex-1 overflow-y-auto rounded-lg p-4">
                  <pre className="font-mono text-sm whitespace-pre-wrap">
                    {selectedRevision?.content}
                  </pre>
                </div>
              </div>
            ) : (
              <>
                <h2 className="font-semibold sm:text-lg md:text-xl xl:text-2xl">
                  Newsletter Template
                </h2>
                <p className="py-8 text-center text-gray-500">
                  {selectedProject
                    ? "You have not generated any newsletter templates for this project"
                    : "Select a video to generate template"}
                </p>
              </>
            )}
          </div>
        </div>
      </main>

      <NewsletterTemplateModal
        open={modalIsOpen}
        closeModal={() => setModalIsOpen(false)}
        addNewTemplateToProject={addNewTemplateToProject}
        creditsUsed={creditsUsed}
        project={selectedProject}
        totalCredits={totalCredits}
      />
    </>
  );
}
