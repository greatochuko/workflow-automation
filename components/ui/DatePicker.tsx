import useClickOutside from "@/hooks/useClickOutside";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

export default function DatePicker({
  date,
  onChange,
  className = "",
}: {
  date: Date | null;
  onChange: (newDate: Date) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(date || new Date());

  const [datePickerRef] = useClickOutside(() => {
    setOpen(false);
  });

  const renderHeader = () => (
    <div className="flex items-center justify-between p-2">
      <button
        className="hover:bg-accent hover:border-accent rounded-md border border-gray-200 p-1.5 duration-200 hover:text-white"
        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </button>
      <span className="text-sm font-medium">
        {format(currentMonth, "MMMM yyyy")}
      </span>
      <button
        className="hover:bg-accent hover:border-accent rounded-md border border-gray-200 p-1.5 duration-200 hover:text-white"
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
      >
        <ChevronRightIcon className="h-4 w-4" />
      </button>
    </div>
  );

  const renderDays = () => {
    const days = [];
    const start = startOfWeek(currentMonth, { weekStartsOn: 0 });
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center text-xs font-medium text-gray-500">
          {format(addDays(start, i), "EEEEE")}
        </div>,
      );
    }
    return <div className="grid grid-cols-7 px-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const today = new Date();
        const isSelected = date && isSameDay(day, date);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isDisabled = day < new Date(today.setHours(0, 0, 0, 0));

        days.push(
          <button
            key={cloneDay.toString()}
            onClick={() => onChange(cloneDay)}
            disabled={isDisabled}
            className={`hover:bg-accent flex h-9 w-9 items-center justify-center rounded-md text-sm transition-colors hover:text-white disabled:hover:bg-gray-200 ${isToday(day) ? "border border-gray-300" : ""} ${
              isSelected
                ? "bg-accent text-white"
                : !isCurrentMonth
                  ? "text-gray-400"
                  : "disabled:hover:text-foreground"
            }`}
          >
            {format(day, "d")}
          </button>,
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 px-2" key={day.toString()}>
          {days}
        </div>,
      );
      days = [];
    }

    return <div className="space-y-1 py-1">{rows}</div>;
  };

  return (
    <div ref={datePickerRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={twMerge(
          `bg-background hover:bg-accent flex w-full items-center gap-2 rounded-md border border-gray-300 p-2 px-4 text-left duration-200 hover:text-white ${date ? "text-foreground" : "text-gray-500"}`,
          className,
        )}
      >
        <CalendarIcon className="h-4 w-4" />
        {date ? format(new Date(date), "MMMM do, yyyy") : "Select Date"}
      </button>

      <div
        className={`absolute bottom-0 left-1/2 w-[260px] -translate-x-1/2 -translate-y-10 overflow-hidden rounded-md border border-gray-300 bg-white shadow ${open ? "" : "hidden"}`}
      >
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>
    </div>
  );
}
