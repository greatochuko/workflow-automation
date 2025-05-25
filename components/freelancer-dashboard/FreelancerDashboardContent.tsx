"use client";

import { ProjectType } from "@/types/project";
import React, { useState } from "react";
import ToggleSidebarButton from "../sidebar/ToggleSidebarButton";
import ContentCalendar from "../client-dashboard/ContentCalendar";
import Button from "../ui/Button";
import { UploadIcon } from "lucide-react";
import ProjectDetailsModal from "../project/ProjectDetailsModal";
import ProjectSubmissionModal from "../project/ProjectSubmissionModal";

export default function FreelancerDashboardContent({
  projects: fetchedProjects,
}: {
  projects: ProjectType[];
}) {
  const [projects, setProjects] = useState(fetchedProjects);
  const [projectDetailsModalOpen, setProjectDetailsModalOpen] = useState(false);
  const [projectToView, setProjectToView] = useState<ProjectType | null>(null);
  const [projectSubmissionModalOpen, setProjectSubmissionModalOpen] =
    useState(false);
  const [projectToSubmit, setProjectToSubmit] = useState<ProjectType | null>(
    null,
  );

  const unCompletedProjects = projects.filter(
    (project) =>
      project.status === "IN_PROGRESS" || project.status !== "REJECTED",
  );

  function closeProjectDetailsModal() {
    setProjectDetailsModalOpen(false);
    setTimeout(() => {
      setProjectToView(null);
    }, 300);
  }

  function closeProjectSubmissionModal() {
    setProjectSubmissionModalOpen(false);
    setTimeout(() => {
      setProjectToSubmit(null);
    }, 300);
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-200 px-[5%] py-4">
        <h1 className="text-xl font-bold capitalize md:text-2xl xl:text-[28px]">
          <ToggleSidebarButton />
          Freelancer Dashboard
        </h1>
      </div>
      <div className="mx-auto flex w-[90%] max-w-7xl flex-col gap-6 py-4">
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold sm:text-xl">
            Videos requiring your attendtion ({unCompletedProjects.length})
          </h3>
          <div className="w-full overflow-x-auto">
            <div className="flex gap-3">
              {unCompletedProjects.length > 1 ? (
                unCompletedProjects.map((project) => (
                  <div
                    key={project.id}
                    className="max-w-xs min-w-[188px] flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
                  >
                    <div className="aspect-video bg-gray-200"></div>
                    <div className="flex flex-col gap-2 p-2 text-xs">
                      <div className="">
                        <h4 className="font-medium">{project.title}</h4>
                        <p className="text-gray-500">{project.videoType}</p>
                      </div>
                      <Button
                        onClick={() => {
                          setProjectToSubmit(project);
                          setProjectSubmissionModalOpen(true);
                        }}
                        className="px-3 py-1.5 text-xs"
                      >
                        <UploadIcon className="h-4 w-4" />
                        Submit Edited Video
                      </Button>
                      <button
                        onClick={() => {
                          setProjectToView(project);
                          setProjectDetailsModalOpen(true);
                        }}
                        className="hover:bg-accent hover:border-accent rounded-md border border-gray-200 px-3 py-1.5 font-medium duration-200 hover:text-white"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500">
                  All your assigned projects are either completed or do not
                  require action.
                </div>
              )}
            </div>
          </div>
        </div>
        <ContentCalendar
          projects={projects as ProjectType[]}
          setProjects={setProjects}
          readOnly
          setProjectToView={setProjectToView}
          setProjectDetailsModalOpen={setProjectDetailsModalOpen}
        />
      </div>

      <ProjectDetailsModal
        closeModal={closeProjectDetailsModal}
        open={projectDetailsModalOpen}
        project={projectToView}
        showAiResponse={true}
      />

      <ProjectSubmissionModal
        closeModal={closeProjectSubmissionModal}
        open={projectSubmissionModalOpen}
        project={projectToSubmit}
      />
    </>
  );
}
