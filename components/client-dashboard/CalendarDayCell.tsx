import React, { useMemo, useState } from "react";
import { format, isBefore, isSameDay, isToday } from "date-fns";
import { ProjectType } from "@/types/project";
import { ProjectStatus } from "@prisma/client";
import { twMerge } from "tailwind-merge";

export function getEventColorClass(status: ProjectStatus) {
  switch (status) {
    case "IN_PROGRESS":
      return "bg-indigo-500";
    case "SUBMITTED":
      return "bg-amber-500";
    case "APPROVED":
      return "bg-emerald-500";
    case "REJECTED":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

interface CalendarDayCellProps {
  day: Date;
  projects: ProjectType[];
  isCurrentMonth: boolean;
  onDrop: (e: React.DragEvent, date: Date) => void;
  readOnly: boolean;
}

export default function CalendarDayCell({
  day,
  projects,
  isCurrentMonth,
  readOnly,
  onDrop,
}: CalendarDayCellProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const dayProjects = useMemo(() => {
    return projects.filter((event) => isSameDay(event.scheduledDate, day));
  }, [projects, day]);
  const [draggingProjectId, setDraggingProjectId] = useState("");

  const isBeforeToday = isBefore(day, new Date());

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDraggingOver(true);
      }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={(e) => {
        setIsDraggingOver(false);
        const draggedProjectId = e.dataTransfer.getData("text/plain");
        const draggedProject = projects.find((p) => p.id === draggedProjectId);
        if (
          !draggedProject ||
          isSameDay(draggedProject.scheduledDate, day) ||
          isBeforeToday
        ) {
          return;
        }

        onDrop(e, day);
      }}
      className={twMerge(
        `flex h-24 flex-col items-end gap-1 rounded-md border p-1 duration-200 ${isToday(day) ? "border-foreground" : "border-gray-300"} ${
          isCurrentMonth
            ? "bg-white"
            : "border-gray-200 bg-gray-50 text-gray-500"
        } ${isDraggingOver && !isBeforeToday ? "bg-accent/10 border-accent border-dashed" : ""}`,
      )}
    >
      <span className="block text-xs">{format(day, "d")}</span>
      <ul className="flex w-full flex-col gap-1">
        {dayProjects.map((project) => (
          <li
            key={project.id}
            draggable={!isBeforeToday && !readOnly}
            onDragStart={(e) => {
              if (isBeforeToday || readOnly) return;
              setDraggingProjectId(project.id);
              e.dataTransfer.setData("text/plain", project.id);
            }}
            onDragEnd={() => {
              if (isBeforeToday || readOnly) return;
              setDraggingProjectId("");
            }}
            className={`overflow-hidden rounded px-1 py-0.5 text-[10.5px] overflow-ellipsis whitespace-nowrap text-white ${
              draggingProjectId === project.id ? "opacity-50" : ""
            } ${getEventColorClass(project.status)} ${isBeforeToday ? "opacity-50" : ""} ${readOnly ? "" : "cursor-pointer"}`}
          >
            {project.title}
            <span className="text-gray-300"> [{project.videoType}]</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
