"use client";
import { CheckIcon, ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import useClickOutside from "@/hooks/useClickOutside";

type OptionType = { value: string; label: React.ReactElement<HTMLElement> };

export default function Select({
  value,
  onChange,
  options,
  placeholder = "Select",
  className,
  containerClassName,
  dropdownClassname,
  disabled = false,
  showCheckmark = false,
}: {
  value: string;
  onChange: (value: string) => void;
  options: OptionType[];
  placeholder?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  dropdownClassname?: string;
  disabled?: boolean;
  showCheckmark?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [selectRef] = useClickOutside(() => setOpen(false));

  const selectedOption = options.find((opt) => opt.value === value);

  function toggle() {
    if (!disabled) setOpen((prev) => !prev);
  }

  function handleSelect(val: string) {
    onChange(val);
    setOpen(false);
  }

  return (
    <div
      className={twMerge("relative text-sm", containerClassName)}
      ref={selectRef}
      tabIndex={-1}
    >
      <div
        tabIndex={0}
        onClick={toggle}
        onKeyDown={(e) => {
          if (["Enter", "Space"].includes(e.code)) {
            e.preventDefault();
            toggle();
          }
          if (e.code === "Escape") {
            setOpen(false);
          }
          if (e.code === "ArrowUp") {
            const currOptionIndex = options.findIndex(
              (opt) => opt.value === selectedOption?.value,
            );
            let prevOptionIndex;
            if (currOptionIndex <= 0) {
              prevOptionIndex = options.length - 1;
            } else {
              prevOptionIndex = currOptionIndex - 1;
            }
            const prevOption = options[prevOptionIndex].value;
            onChange(prevOption);
          }
          if (e.code === "ArrowDown") {
            const currOptionIndex = options.findIndex(
              (opt) => opt.value === selectedOption?.value,
            );
            let nextOptionIndex;
            if (currOptionIndex >= options.length - 1) {
              nextOptionIndex = 0;
            } else {
              nextOptionIndex = currOptionIndex + 1;
            }
            const nextOption = options[nextOptionIndex].value;
            onChange(nextOption);
          }
        }}
        className={twMerge(
          `w-full cursor-pointer overflow-hidden rounded-md border border-gray-300 px-3 py-2 pr-8 overflow-ellipsis whitespace-nowrap ring-gray-500 ring-offset-2 duration-200 hover:bg-gray-100 focus-visible:ring-2 disabled:cursor-default ${
            disabled ? "border-gray-200 bg-gray-100 text-gray-400" : ""
          }`,
          className,
        )}
        // style={{ cursor: disabled ? "default" : "pointer" }}
      >
        {React.isValidElement(selectedOption?.label) ? (
          React.cloneElement(selectedOption.label, {
            className: twMerge(
              "overflow-ellipsis overflow-hidden",
              selectedOption.label.props.className, // preserve original classes
            ),
          })
        ) : (
          <span className="overflow-hidden overflow-ellipsis">
            {selectedOption?.label || placeholder}
          </span>
        )}
        {open ? (
          <ChevronUp className="absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2" />
        ) : (
          <ChevronDown className="absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2" />
        )}
      </div>

      {open && (
        <div
          className={twMerge(
            "absolute top-full z-10 mt-1 max-h-60 w-fit min-w-full overflow-y-auto rounded-md border border-gray-300 bg-white p-1 shadow duration-200",
            dropdownClassname,
          )}
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              aria-selected={opt.value === value}
              onClick={() => handleSelect(opt.value)}
              className={twMerge(
                "group aria-selected:bg-accent flex cursor-pointer items-center gap-2 rounded-sm p-2 whitespace-nowrap duration-100 hover:bg-gray-100 aria-selected:text-white",
                value === opt.value && "bg-gray-100",
              )}
            >
              {showCheckmark &&
                (value === opt.value ? (
                  <CheckIcon className="h-4 w-4" />
                ) : (
                  <div className="h-4 w-4" />
                ))}
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
