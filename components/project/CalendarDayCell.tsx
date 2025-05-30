import React, { useMemo, useRef, useState } from "react";
import { format, isBefore, isSameDay, isToday, startOfDay } from "date-fns";
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
  onDrop: (projectId: string, date: Date) => void;
  readOnly: boolean;
  setProjectDetailsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setProjectToView: React.Dispatch<React.SetStateAction<ProjectType | null>>;
  draggingProjectId: string;
  setDraggingProjectId: React.Dispatch<React.SetStateAction<string>>;
}

export default function CalendarDayCell({
  day,
  projects,
  isCurrentMonth,
  readOnly,
  onDrop,
  setProjectDetailsModalOpen,
  setProjectToView,
  draggingProjectId,
  setDraggingProjectId,
}: CalendarDayCellProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const touchItemRef = useRef<HTMLElement | null>(null);

  const dayProjects = useMemo(() => {
    return projects.filter((event) => isSameDay(event.scheduledDate, day));
  }, [projects, day]);

  const isBeforeToday = useMemo(
    () => isBefore(day, startOfDay(new Date())),
    [day],
  );

  function handleDropProject(e: React.DragEvent) {
    e.preventDefault();
    if (readOnly || isBeforeToday) return;
    setIsDraggingOver(false);
    const draggedProject = projects.find((p) => p.id === draggingProjectId);
    if (!draggedProject || isSameDay(draggedProject.scheduledDate, day)) return;
    onDrop(draggedProject.id, day);
    setDraggingProjectId("");
  }

  function handleTouchStart(
    projectId: string,
    e: React.TouchEvent<HTMLElement>,
  ) {
    if (isBeforeToday || readOnly) return;
    setDraggingProjectId(projectId);
    touchItemRef.current = e.currentTarget;
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (isBeforeToday || readOnly) return;
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropCell = target?.closest("[data-date]");

    if (dropCell && dropCell.getAttribute("data-date") === day.toISOString()) {
      setIsDraggingOver(true);
    } else {
      setIsDraggingOver(false);
    }
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (isBeforeToday || readOnly) return;
    const touch = e.changedTouches[0];
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!dropTarget) return;

    // Find closest CalendarDayCell container
    const dropCell = dropTarget.closest("[data-date]");
    if (!dropCell) return;

    const dropDateStr = dropCell.getAttribute("data-date");
    if (!dropDateStr) return;

    const dropDate = new Date(dropDateStr);
    const draggedProject = projects.find((p) => p.id === draggingProjectId);
    if (!draggedProject || isSameDay(draggedProject.scheduledDate, dropDate))
      return;

    onDrop(draggedProject.id, dropDate);
    setDraggingProjectId("");
  }

  return (
    <div
      data-date={day.toISOString()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDraggingOver(true);
      }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={handleDropProject}
      className={twMerge(
        `flex h-24 flex-col items-end gap-1 rounded-md border p-1 duration-200 ${
          isToday(day) ? "border-foreground" : "border-gray-300"
        } ${
          isCurrentMonth
            ? "bg-white"
            : "border-gray-200 bg-gray-50 text-gray-500"
        } ${
          isDraggingOver && !isBeforeToday
            ? "bg-accent/10 border-accent border-dashed"
            : ""
        }`,
      )}
    >
      <span className="block text-xs">{format(day, "d")}</span>
      <ul className="flex min-h-0 w-full flex-1 flex-col gap-1 overflow-y-auto">
        {dayProjects.map((project) => (
          <li
            key={project.id}
            draggable={
              (project.status === "IN_PROGRESS" || !isBeforeToday) && !readOnly
            }
            onDragStart={() => {
              if (isBeforeToday || readOnly) return;
              setDraggingProjectId(project.id);
            }}
            onDragEnd={() => {
              if (isBeforeToday || readOnly) return;
              setDraggingProjectId("");
            }}
            onTouchStart={(e) => handleTouchStart(project.id, e)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={() => {
              setProjectToView(project);
              setProjectDetailsModalOpen(true);
            }}
            className={`min-h-5 cursor-pointer overflow-hidden rounded px-1 py-0.5 text-[10.5px] overflow-ellipsis whitespace-nowrap text-white ${
              draggingProjectId === project.id ? "opacity-50" : ""
            } ${getEventColorClass(project.status)} ${
              isBeforeToday ? "opacity-70" : ""
            }`}
          >
            {project.title}
            <span className="text-gray-300"> [{project.videoType}]</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
