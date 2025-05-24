"use client";

import { ProjectType } from "@/types/project";
import { useState } from "react";
import { toast } from "sonner";
import CalendarView from "./CalendarView";
import { updateProjectDate } from "@/actions/projectActions";

interface CalendarContainerProps {
  projects: ProjectType[];
  readOnly?: boolean;
  setProjects: React.Dispatch<React.SetStateAction<ProjectType[]>>;
}

export default function ContentCalendar({
  projects,
  readOnly = false,
  setProjects,
}: CalendarContainerProps) {
  const [viewMode, setViewMode] = useState<"twoWeeks" | "month">("month");

  async function handleProjectDrop(projectId: string, newDate: Date) {
    if (readOnly) return;
    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === projectId ? { ...proj, scheduledDate: newDate } : proj,
      ),
    );
    toast.success("Content rescheduled successfully!");
    await updateProjectDate(projectId, newDate);
  }

  return (
    <div className="mx-auto flex w-[90%] max-w-7xl flex-col gap-6 py-4">
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
        readOnly={readOnly}
        viewMode={viewMode}
      />
    </div>
  );
}
