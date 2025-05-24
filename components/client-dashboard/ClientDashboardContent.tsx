"use client";

import React, { useState } from "react";
import ContentCalendar from "@/components/client-dashboard/ContentCalendar";
import UploadVideoButton from "@/components/client-dashboard/UploadVideoButton";
import ToggleSidebarButton from "@/components/sidebar/ToggleSidebarButton";
import { ProjectType } from "@/types/project";

export default function ClientDashboardContent({
  clientVideoTypes,
  projects: fetchedProjects,
}: {
  clientVideoTypes: string[];
  projects: ProjectType[];
}) {
  const [projects, setProjects] = useState(fetchedProjects);

  function updateProjects(updatedProject: ProjectType) {
    setProjects((prev) => [...prev, updatedProject]);
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-200 px-[5%] py-4">
        <h1 className="text-xl font-bold capitalize md:text-2xl xl:text-[28px]">
          <ToggleSidebarButton />
          Client Dashboard
        </h1>
        <UploadVideoButton
          updateProjects={updateProjects}
          videoTypes={clientVideoTypes}
        />
      </div>
      <ContentCalendar
        projects={projects as ProjectType[]}
        setProjects={setProjects}
      />
    </>
  );
}
