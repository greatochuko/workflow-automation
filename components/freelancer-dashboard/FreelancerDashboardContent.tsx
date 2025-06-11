"use client";

import { ProjectType } from "@/types/project";
import React, { useMemo, useState } from "react";
import ToggleSidebarButton from "../sidebar/ToggleSidebarButton";

import ProjectDetailsModal from "../project/ProjectDetailsModal";
import PendingProjectsSection from "./PendingProjectsSection";
import ContentCalendar from "../project/ContentCalendar";
import Select from "../ui/Select";
import { UserType } from "@/types/user";

export default function FreelancerDashboardContent({
  projects: fetchedProjects,
  clients,
}: {
  projects: ProjectType[];
  clients: UserType[];
}) {
  const [projects, setProjects] = useState(fetchedProjects);
  const [projectDetailsModalOpen, setProjectDetailsModalOpen] = useState(false);
  const [projectToView, setProjectToView] = useState<ProjectType | null>(null);
  const [selectedClientId, setSelectedClientId] = useState("all");

  const selectedClient = useMemo(
    () => clients.find((cl) => cl.id === selectedClientId),
    [clients, selectedClientId],
  );

  const filteredProjects = useMemo(
    () =>
      selectedClient
        ? projects.filter((prj) => prj.createdById === selectedClient.id)
        : projects,
    [projects, selectedClient],
  );

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
      <div className="flex items-center justify-between gap-2 border-b border-gray-200 px-[5%] py-4">
        <h1 className="flex text-xl font-bold capitalize md:text-2xl xl:text-[28px]">
          <ToggleSidebarButton />
          <span className="hidden min-[480px]:inline">
            Freelancer Dashboard
          </span>
          <span className="min-[480px]:hidden">Dashboard</span>
        </h1>
        <Select
          value={selectedClientId}
          onChange={(value) => setSelectedClientId(value)}
          containerClassName="w-40"
          placeholder="Select a client"
          options={[
            { value: "all", label: <span>All</span> },
            ...clients.map((client) => ({
              value: client.id,
              label: <span key={client.id}>{client.fullName}</span>,
            })),
          ]}
        />
      </div>

      <div className="mx-auto flex w-[90%] max-w-7xl flex-col gap-6 py-4">
        <PendingProjectsSection
          projects={filteredProjects}
          updateProjectList={updateProjectList}
          setProjectDetailsModalOpen={setProjectDetailsModalOpen}
          setProjectToView={setProjectToView}
        />
        <ContentCalendar
          projects={filteredProjects as ProjectType[]}
          setProjects={setProjects}
          setProjectToView={setProjectToView}
          setProjectDetailsModalOpen={setProjectDetailsModalOpen}
        />
      </div>

      <ProjectDetailsModal
        key={projectToView?.id}
        closeModal={closeProjectDetailsModal}
        open={projectDetailsModalOpen}
        project={projectToView}
        showAiResponse={true}
        removeFromProjectList={removeFromProjectList}
        updateProjectList={updateProjectList}
      />
    </>
  );
}
