import { CheckIcon } from "lucide-react";
import React from "react";

export default function Checkbox({
  checked,
  onCheckChange,
}: {
  checked: boolean;
  onCheckChange: () => void;
}) {
  return (
    <div
      onClick={onCheckChange}
      className={`border-accent-black flex h-4 w-4 items-center justify-center rounded-sm border text-white ${checked ? "bg-accent-black" : ""}`}
    >
      {checked && <CheckIcon size={14} />}
    </div>
  );
}
