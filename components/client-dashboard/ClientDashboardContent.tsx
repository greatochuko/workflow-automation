"use client";

import React, { useState } from "react";
import ContentCalendar from "@/components/project/ContentCalendar";
import UploadVideoButton from "@/components/client-dashboard/UploadVideoButton";
import ToggleSidebarButton from "@/components/sidebar/ToggleSidebarButton";
import { ProjectType } from "@/types/project";
import ProjectDetailsModal from "../project/ProjectDetailsModal";
import ProjectsAwaitingApprovalSection from "./ProjectsAwaitingAprovalSection";
import { VideoScriptType } from "@/types/videoScript";

export default function ClientDashboardContent({
  clientVideoTypes,
  clientVideoScripts,
  projects: fetchedProjects,
}: {
  clientVideoTypes: string[];
  clientVideoScripts: VideoScriptType[];
  projects: ProjectType[];
}) {
  const [projects, setProjects] = useState(fetchedProjects);
  const [projectDetailsModalOpen, setProjectDetailsModalOpen] = useState(false);
  const [projectToView, setProjectToView] = useState<ProjectType | null>(null);

  function updateProjects(updatedProject: ProjectType) {
    setProjects((prev) => [...prev, updatedProject]);
  }

  function closeProjectDetailsModal() {
    setProjectDetailsModalOpen(false);
    setTimeout(() => {
      setProjectToView(null);
    }, 300);
  }

  function updateProjectList(updatedProject: ProjectType) {
    setProjects((curr) =>
      curr.map((project) =>
        project.id === updatedProject.id ? updatedProject : project,
      ),
    );
  }

  function removeFromProjectList(deletedProjectId: string) {
    setProjects((curr) =>
      curr.filter((project) => project.id !== deletedProjectId),
    );
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-200 px-[5%] py-4">
        <h1 className="flex text-lg font-bold capitalize sm:text-xl md:text-2xl xl:text-[28px]">
          <ToggleSidebarButton />
          Client Dashboard
        </h1>
        <UploadVideoButton
          updateProjects={updateProjects}
          videoTypes={clientVideoTypes}
          videoScripts={clientVideoScripts}
        />
      </div>

      <div className="mx-auto flex w-[90%] max-w-7xl flex-col gap-6 py-4">
        <ProjectsAwaitingApprovalSection
          projects={projects}
          updateProjectList={updateProjectList}
          setProjectDetailsModalOpen={setProjectDetailsModalOpen}
          setProjectToView={setProjectToView}
        />

        <ContentCalendar
          projects={projects}
          setProjects={setProjects}
          setProjectToView={setProjectToView}
          setProjectDetailsModalOpen={setProjectDetailsModalOpen}
        />
      </div>

      <ProjectDetailsModal
        closeModal={closeProjectDetailsModal}
        open={projectDetailsModalOpen}
        project={projectToView}
        showAiResponse={projectToView?.status !== "IN_PROGRESS"}
        isClientProject
        removeFromProjectList={removeFromProjectList}
      />
    </>
  );
}
