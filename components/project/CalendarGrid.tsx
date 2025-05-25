import { ProjectType } from "@/types/project";
import React from "react";
import { isSameMonth } from "date-fns";
import CalendarDayCell from "./CalendarDayCell";

interface CalendarGridProps {
  viewMode: "twoWeeks" | "month";
  calendarDates: Date[];
  weeks: number[];
  filteredProjects: ProjectType[];
  currentDate: Date;
  onDrop: (e: React.DragEvent, date: Date) => void;
  readOnly: boolean;
  setProjectDetailsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setProjectToView: React.Dispatch<React.SetStateAction<ProjectType | null>>;
}

export default function CalendarGrid({
  viewMode,
  calendarDates,
  weeks,
  filteredProjects,
  currentDate,
  onDrop,
  readOnly,
  setProjectDetailsModalOpen,
  setProjectToView,
}: CalendarGridProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid max-w-full grid-cols-7 gap-2 overflow-hidden">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
          <div key={i} className="py-1 text-center text-sm font-medium">
            {day}
          </div>
        ))}
      </div>
      <div className="grid max-w-full grid-cols-7 gap-2 overflow-hidden">
        {viewMode === "month"
          ? weeks.map((weekIndex) => {
              const weekDays = calendarDates.slice(
                weekIndex * 7,
                weekIndex * 7 + 7,
              );
              return weekDays.length > 0 ? (
                <React.Fragment key={weekIndex}>
                  {weekDays.map((day, i) => (
                    <CalendarDayCell
                      key={`${weekIndex}-${i}`}
                      day={day}
                      projects={filteredProjects}
                      isCurrentMonth={isSameMonth(day, currentDate)}
                      onDrop={onDrop}
                      readOnly={readOnly}
                      setProjectToView={setProjectToView}
                      setProjectDetailsModalOpen={setProjectDetailsModalOpen}
                    />
                  ))}
                </React.Fragment>
              ) : null;
            })
          : calendarDates.map((day, i) => (
              <CalendarDayCell
                key={i}
                day={day}
                projects={filteredProjects}
                isCurrentMonth={true}
                onDrop={onDrop}
                readOnly={readOnly}
                setProjectToView={setProjectToView}
                setProjectDetailsModalOpen={setProjectDetailsModalOpen}
              />
            ))}
      </div>
    </div>
  );
}
