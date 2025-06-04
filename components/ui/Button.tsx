import React, { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export default function Button({
  children,
  className = "",
  type = "button",
  variant = "default",
  ...props
}: PropsWithChildren<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "outline" | "default";
  }
>) {
  return (
    <button
      type={type}
      className={twMerge(
        "flex cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium duration-200 disabled:cursor-not-allowed",
        variant === "outline"
          ? "border border-gray-200 hover:bg-gray-100"
          : "bg-accent-black hover:bg-accent-black/85 disabled:bg-accent-black/50 text-white",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
