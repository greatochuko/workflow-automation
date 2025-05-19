import React, { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export default function CustomButton({
  children,
  className = "",
  ...props
}: PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      type="button"
      className={twMerge(
        "bg-accent-black hover:bg-accent-black/85 disabled:bg-accent-black/50 flex cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white duration-200 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
