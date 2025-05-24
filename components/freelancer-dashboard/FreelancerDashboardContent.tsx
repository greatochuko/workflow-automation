"use client";

import { ProjectType } from "@/types/project";
import React, { useState } from "react";
import ToggleSidebarButton from "../sidebar/ToggleSidebarButton";
import ContentCalendar from "../client-dashboard/ContentCalendar";

export default function FreelancerDashboardContent({
  projects: fetchedProjects,
}: {
  projects: ProjectType[];
}) {
  const [projects, setProjects] = useState(fetchedProjects);

  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-200 px-[5%] py-4">
        <h1 className="text-xl font-bold capitalize md:text-2xl xl:text-[28px]">
          <ToggleSidebarButton />
          Freelancer Dashboard
        </h1>
      </div>
      <ContentCalendar
        projects={projects as ProjectType[]}
        setProjects={setProjects}
        readOnly
      />
    </>
  );
}
