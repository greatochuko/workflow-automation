"use client";

import { ProjectType } from "@/types/project";
import React, { useState } from "react";
import ToggleSidebarButton from "../sidebar/ToggleSidebarButton";

import ProjectDetailsModal from "../project/ProjectDetailsModal";
import PendingProjectsSection from "./PendingProjectsSection";
import ContentCalendar from "../project/ContentCalendar";

export default function FreelancerDashboardContent({
  projects: fetchedProjects,
}: {
  projects: ProjectType[];
}) {
  const [projects, setProjects] = useState(fetchedProjects);
  const [projectDetailsModalOpen, setProjectDetailsModalOpen] = useState(false);
  const [projectToView, setProjectToView] = useState<ProjectType | null>(null);

  function closeProjectDetailsModal() {
    setProjectDetailsModalOpen(false);
    setTimeout(() => {
      setProjectToView(null);
    }, 300);
  }

  function updateProjectList(updatedProject: ProjectType) {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
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
        <h1 className="flex text-xl font-bold capitalize md:text-2xl xl:text-[28px]">
          <ToggleSidebarButton />
          Freelancer Dashboard
        </h1>
      </div>
      <div className="mx-auto flex w-[90%] max-w-7xl flex-col gap-6 py-4">
        <PendingProjectsSection
          projects={projects}
          updateProjectList={updateProjectList}
          setProjectDetailsModalOpen={setProjectDetailsModalOpen}
          setProjectToView={setProjectToView}
        />
        <ContentCalendar
          projects={projects as ProjectType[]}
          setProjects={setProjects}
          setProjectToView={setProjectToView}
          setProjectDetailsModalOpen={setProjectDetailsModalOpen}
        />
      </div>

      <ProjectDetailsModal
        closeModal={closeProjectDetailsModal}
        open={projectDetailsModalOpen}
        project={projectToView}
        showAiResponse={true}
        removeFromProjectList={removeFromProjectList}
      />
    </>
  );
}
