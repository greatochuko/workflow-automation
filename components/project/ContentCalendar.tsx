"use client";

import { ProjectType } from "@/types/project";
import { useState } from "react";
import { toast } from "sonner";
import CalendarView from "./CalendarView";
import { updateProjectDate } from "@/actions/projectActions";

interface CalendarContainerProps {
  projects: ProjectType[];
  setProjects: React.Dispatch<React.SetStateAction<ProjectType[]>>;
  setProjectDetailsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setProjectToView: React.Dispatch<React.SetStateAction<ProjectType | null>>;
}

export default function ContentCalendar({
  projects,
  setProjects,
  setProjectDetailsModalOpen,

  setProjectToView,
}: CalendarContainerProps) {
  const [viewMode, setViewMode] = useState<"twoWeeks" | "month">("twoWeeks");

  async function handleProjectDrop(projectId: string, newDate: Date) {
    let updatedDate: Date | null = null;
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;
        const oldDate = new Date(proj.scheduledDate);
        updatedDate = new Date(newDate);
        updatedDate.setHours(
          oldDate.getHours(),
          oldDate.getMinutes(),
          oldDate.getSeconds(),
          oldDate.getMilliseconds(),
        );
        return { ...proj, scheduledDate: updatedDate };
      }),
    );
    toast.success("Content rescheduled successfully!");
    if (updatedDate) {
      await updateProjectDate(projectId, updatedDate);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold whitespace-nowrap sm:text-xl lg:text-2xl">
          Content Calendar
        </h2>
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            className={`rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium whitespace-nowrap duration-200 hover:text-white ${viewMode === "twoWeeks" ? "bg-accent-black text-white" : "hover:bg-accent"}`}
            onClick={() => setViewMode("twoWeeks")}
          >
            2 Weeks
          </button>
          <button
            className={`rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium duration-200 hover:text-white ${viewMode === "month" ? "bg-accent-black text-white" : "hover:bg-accent"}`}
            onClick={() => setViewMode("month")}
          >
            Month
          </button>
        </div>
      </div>
      <CalendarView
        projects={projects}
        onProjectDrop={handleProjectDrop}
        viewMode={viewMode}
        setProjectToView={setProjectToView}
        setProjectDetailsModalOpen={setProjectDetailsModalOpen}
      />
    </div>
  );
}
