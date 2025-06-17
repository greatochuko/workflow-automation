"use client";

import { ProjectType } from "@/types/project";
import React, { useMemo, useState } from "react";
import ProjectThumbnail from "../project/ProjectThumbnail";
import { format } from "date-fns";
import Button from "../ui/Button";
import {
  CalendarIcon,
  CopyIcon,
  DownloadIcon,
  LoaderIcon,
  SparklesIcon,
  VideoIcon,
  YoutubeIcon,
} from "lucide-react";
import { YoutubeContentType } from "@/types/youtubeContent";
import { toast } from "sonner";
import { createYoutubeContent } from "@/actions/youtubeContentActions";

export default function YoutubeRepurposingPageContent({
  projects,
}: {
  projects: ProjectType[];
}) {
  const [projectList, setProjectList] = useState(projects);
  const [loading, setLoading] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const selectedProject = useMemo(
    () => projectList.find((pr) => pr.id === selectedProjectId),
    [projectList, selectedProjectId],
  );

  function toggleSelectProject(projectId: string) {
    setSelectedProjectId((prev) => (prev === projectId ? "" : projectId));
  }

  function addNewYoutubeContentToProject(
    projectId: string,
    newYoutubeContent: YoutubeContentType,
  ) {
    setProjectList((prev) =>
      prev.map((prj) =>
        prj.id === projectId
          ? {
              ...prj,
              youtubeContent: newYoutubeContent,
            }
          : prj,
      ),
    );
  }

  async function handleGenerateYoutubeContent() {
    if (!selectedProject) return;
    setLoading(true);

    const { data: newYoutubeContent, error } = await createYoutubeContent(
      selectedProject.id,
    );

    if (newYoutubeContent) {
      addNewYoutubeContentToProject(selectedProject.id, newYoutubeContent);
      toast.success("Yutube content generated successfully!");
    } else {
      toast.error(error);
    }
    setLoading(false);
  }

  function getFullContent(youtubeContent: {
    title: string;
    description: string;
    tags: string[];
    thumbnailText: string[];
  }) {
    const allYoutubeContent = {
      title: youtubeContent.title,
      description: youtubeContent.description,
      tags: youtubeContent.tags,
      "Thumbnail Text Ideas": youtubeContent.thumbnailText,
    };

    const fullContent = Object.entries(allYoutubeContent)
      .map(([key, value]) => {
        let content: string;
        if (typeof value === "string") {
          content = value;
        } else if (Array.isArray(value)) {
          content = key === "tags" ? value.join(", ") : value.join(" | ");
        } else {
          content = "";
        }
        return key.toUpperCase() + ":\n" + content;
      })
      .join("\n\n");

    return fullContent;
  }

  function handleCopyAll() {
    if (!selectedProject?.youtubeContent) return;
    const fullContent = getFullContent(selectedProject.youtubeContent);
    navigator.clipboard.writeText(fullContent);
  }

  function handleExport() {
    if (!selectedProject?.youtubeContent) return;
    const fullContent = getFullContent(selectedProject.youtubeContent);
    const blob = new Blob([fullContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `youtube-content-${selectedProject.title.replace(/\s+/g, "-").toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Content exported successfully!");
  }

  return (
    <div className="mx-auto flex w-[90%] max-w-7xl flex-1 flex-col gap-6 py-4 lg:max-h-[calc(100vh-6rem)] lg:flex-row lg:overflow-y-auto">
      <div className="flex max-h-[calc(100vh-10rem)] flex-col gap-4 rounded-md border border-gray-200 bg-white p-4 sm:p-6 lg:h-auto lg:max-h-full lg:flex-1">
        <h2 className="font-semibold sm:text-lg md:text-xl xl:text-2xl">
          Select Project to Repurpose
        </h2>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
          {projectList.map((project) => (
            <div
              key={project.id}
              onClick={() => toggleSelectProject(project.id)}
              className={`flex cursor-pointer flex-col gap-2 rounded-lg border border-gray-200 p-2 duration-200 hover:border-gray-500 ${selectedProjectId === project.id ? "bg-background border-gray-700" : ""}`}
            >
              <div className="flex items-start gap-2">
                <ProjectThumbnail file={project.files[0]} type="content" />
                <div className="flex flex-col">
                  <h4 className="text-sm font-medium">{project.title}</h4>
                  <p className="text-xs text-gray-500">{project.videoType}</p>
                  <p className="flex items-center gap-1.5 text-xs text-gray-500">
                    <CalendarIcon className="h-3 w-3" />
                    {format(new Date(project.scheduledDate), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              {selectedProjectId === project.id && (
                <div className="flex flex-col gap-1.5 text-[.8rem] font-medium">
                  <p>
                    Hook:{" "}
                    <span className="font-normal text-gray-500">
                      {project.captionData.hook}
                    </span>
                  </p>
                  <p>
                    CTA #1:{" "}
                    <span className="font-normal text-gray-500">
                      {project.captionData.cta1}
                    </span>
                  </p>
                  <p>
                    CTA #2:{" "}
                    <span className="font-normal text-gray-500">
                      {project.captionData.cta2}
                    </span>
                  </p>
                  <p>
                    Caption Content:{" "}
                    <span className="font-normal text-gray-500">
                      {project.captionData.captionContent}
                    </span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        <Button
          onClick={handleGenerateYoutubeContent}
          disabled={
            loading || !selectedProject || !!selectedProject.youtubeContent
          }
        >
          {loading ? (
            <>
              <LoaderIcon className="h-4 w-4 animate-spin" /> Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="h-4 w-4" /> Generate YouTube Content
            </>
          )}
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-4 rounded-md border border-gray-200 bg-white p-4 sm:p-6">
        {selectedProject?.youtubeContent ? (
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
            <div className="sticky top-0 -mb-4 flex flex-wrap items-center justify-between gap-4 bg-white pb-4">
              <h2 className="font-semibold whitespace-nowrap md:text-lg xl:text-xl">
                Generated Youtube Content
              </h2>
              <div className="flex gap-4">
                <Button
                  onClick={handleCopyAll}
                  variant="outline"
                  className="hover:bg-accent bg-gray-50 hover:text-white disabled:pointer-events-none disabled:text-gray-500"
                >
                  <CopyIcon className="h-4 w-4" />
                  Copy All
                </Button>
                <Button onClick={handleExport}>
                  <DownloadIcon className={`h-4 w-4`} />
                  Export
                </Button>
              </div>
            </div>

            <div className="bg-background flex flex-col rounded-md border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-500">Title:</h3>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      selectedProject.youtubeContent.title,
                    );
                    toast.success("Title copied to clipboard!");
                  }}
                  className="hover:bg-accent rounded-md p-2 duration-200 hover:text-white"
                >
                  <CopyIcon className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm">{selectedProject.youtubeContent.title}</p>
            </div>

            <div className="bg-background flex flex-col rounded-md border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-500">
                  Description:
                </h3>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      selectedProject.youtubeContent.description,
                    );
                    toast.success("Description copied to clipboard!");
                  }}
                  className="hover:bg-accent rounded-md p-2 duration-200 hover:text-white"
                >
                  <CopyIcon className="h-4 w-4" />
                </button>
              </div>
              <p className="font-mono text-sm">
                {selectedProject.youtubeContent.description}
              </p>
            </div>

            <div className="bg-background flex flex-col rounded-md border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-500">Tags:</h3>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      selectedProject.youtubeContent.tags.join(", "),
                    );
                    toast.success("Tags copied to clipboard!");
                  }}
                  className="hover:bg-accent rounded-md p-2 duration-200 hover:text-white"
                >
                  <CopyIcon className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                {selectedProject.youtubeContent.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-gray-200 p-1 px-2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-background flex flex-col rounded-md border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-500">
                  Thumbnail Text:
                </h3>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      selectedProject.youtubeContent.thumbnailText.join(" | "),
                    );
                    toast.success("Thumbnail Text copied to clipboard!");
                  }}
                  className="hover:bg-accent rounded-md p-2 duration-200 hover:text-white"
                >
                  <CopyIcon className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-col items-center justify-center gap-2 text-xs font-semibold uppercase">
                {selectedProject.youtubeContent.thumbnailText.map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
              </div>
            </div>

            <div className="mt-auto rounded-lg border border-green-200 bg-green-50 p-3">
              <div className="flex items-center gap-2 text-green-800">
                <VideoIcon className="h-4 w-4" />
                <span className="text-sm font-medium">Ready for YouTube!</span>
              </div>
              <p className="mt-1 text-xs text-green-700">
                Your content is optimized and ready to upload to YouTube Shorts.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
            <YoutubeIcon size={48} className="text-gray-500" />
            <h2 className="font-semibold sm:text-lg md:text-xl xl:text-2xl">
              Generate YouTube Content
            </h2>
            <p className="text-gray-500">
              {selectedProject
                ? "No youtube content has been generated for this project yet"
                : "Select a project from the left panel and generate YouTube content to see it here."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
