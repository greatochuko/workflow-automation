import React, { useState, useMemo } from "react";
import { ProjectType } from "@/types/project";
import { ProjectStatus } from "@prisma/client";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import CalendarGrid from "./CalendarGrid";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addWeeks,
  subWeeks,
  subMonths,
  addMonths,
  isSameDay,
  format,
} from "date-fns";

interface CalendarViewProps {
  projects: ProjectType[];
  onProjectDrop: (eventId: string, newDate: Date) => void;
  readOnly?: boolean;
  viewMode: "twoWeeks" | "month";
  setProjectDetailsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setProjectToView: React.Dispatch<React.SetStateAction<ProjectType | null>>;
}

const statusList: { name: string; id: ProjectStatus; color: string }[] = [
  {
    name: "In progress",
    id: "IN_PROGRESS",
    color: "bg-indigo-500 hover:bg-indigo-600",
  },
  {
    name: "Submitted",
    id: "SUBMITTED",
    color: "bg-amber-500 hover:bg-amber-600",
  },
  {
    name: "Approved",
    id: "APPROVED",
    color: "bg-emerald-500 hover:bg-emerald-600",
  },
  { name: "Rejected", id: "REJECTED", color: "bg-red-500 hover:bg-red-600" },
];

export default function CalendarView({
  viewMode,
  readOnly = false,
  onProjectDrop,
  projects,
  setProjectDetailsModalOpen,
  setProjectToView,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStatusList, setSelectedStatusList] = useState<ProjectStatus[]>(
    ["APPROVED", "IN_PROGRESS", "REJECTED", "SUBMITTED"],
  );

  function toggleStatus(statusId: ProjectStatus) {
    setSelectedStatusList((prev) =>
      prev.includes(statusId)
        ? prev.filter((st) => st !== statusId)
        : [...prev, statusId],
    );
  }

  function handlePrev() {
    setCurrentDate((prev) =>
      viewMode === "month" ? subMonths(prev, 1) : subWeeks(prev, 2),
    );
  }

  function handleNext() {
    setCurrentDate((prev) =>
      viewMode === "month" ? addMonths(prev, 1) : addWeeks(prev, 2),
    );
  }

  const calendarDates = useMemo(() => {
    if (viewMode === "month") {
      const start = startOfWeek(startOfMonth(currentDate));
      const end = endOfWeek(endOfMonth(currentDate));
      const days = [];
      let date = start;
      while (date <= end) {
        days.push(date);
        date = addDays(date, 1);
      }
      return days;
    } else {
      const start = startOfWeek(currentDate);
      const days = [];
      for (let i = 0; i < 14; i++) {
        days.push(addDays(start, i));
      }
      return days;
    }
  }, [viewMode, currentDate]);

  const weeks = useMemo(() => {
    return Array.from(
      { length: Math.ceil(calendarDates.length / 7) },
      (_, i) => i,
    );
  }, [calendarDates]);

  const filteredProjects = useMemo(() => {
    return projects.filter(
      (p) =>
        (!selectedStatusList.length || selectedStatusList.includes(p.status)) &&
        calendarDates.some((d) => isSameDay(d, new Date(p.scheduledDate))),
    );
  }, [projects, selectedStatusList, calendarDates]);

  function handleDrop(e: React.DragEvent, date: Date) {
    e.preventDefault();
    const eventId = e.dataTransfer.getData("text/plain");
    onProjectDrop(eventId, date);
  }

  const formatDateRange = () => {
    if (viewMode === "month") {
      return format(currentDate, "MMMM yyyy");
    } else {
      const startDate = calendarDates[0];
      const endDate = calendarDates[calendarDates.length - 1];

      if (startDate.getMonth() === endDate.getMonth()) {
        // Same month
        return `${format(startDate, "MMMM d")} - ${format(endDate, "d, yyyy")}`;
      } else {
        // Different months
        return `${format(startDate, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`;
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-md border border-gray-300 bg-white p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 whitespace-nowrap">
          <button
            onClick={handlePrev}
            className="bg-background hover:bg-accent rounded-md border border-gray-300 p-2 duration-200 hover:text-white"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <h4 className="text-lg font-semibold sm:text-xl">
            {formatDateRange()}
          </h4>
          <button
            onClick={handleNext}
            className="bg-background hover:bg-accent rounded-md border border-gray-300 p-2 duration-200 hover:text-white"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
        <ul className="flex items-center gap-1.5 sm:gap-2">
          {statusList.map((status) => (
            <li
              key={status.id}
              role="button"
              onClick={() => toggleStatus(status.id)}
              className={`cursor-pointer rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap duration-200 ${
                selectedStatusList.includes(status.id)
                  ? `${status.color} text-white`
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {status.name}
            </li>
          ))}
        </ul>
      </div>

      <CalendarGrid
        viewMode={viewMode}
        calendarDates={calendarDates}
        weeks={weeks}
        filteredProjects={filteredProjects}
        currentDate={currentDate}
        onDrop={handleDrop}
        readOnly={readOnly}
        setProjectToView={setProjectToView}
        setProjectDetailsModalOpen={setProjectDetailsModalOpen}
      />
    </div>
  );
}
