import { useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { Upload } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface FileUploadZoneProps {
  onFilesSelected: (files: FileList) => void;
  maxFiles: number;
  disabled?: boolean;
}

export function FileUploadZone({
  onFilesSelected,
  maxFiles,
  disabled = false,
}: FileUploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
    }
  };

  return (
    <>
      <div
        onDragEnter={disabled ? undefined : handleDrag}
        className={twMerge(
          "flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-4 py-8 transition-colors duration-200 sm:px-6 sm:py-10",
          dragActive
            ? "border-accent bg-accent/5"
            : "hover:border-accent/50 hover:bg-accent/5",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="video/*,image/*"
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center text-center">
          <Upload className="mb-4 h-10 w-10 text-gray-400" />
          <h3 className="text-lg font-medium">
            Drag and drop video or image files
          </h3>
          <p className="mt-1 mb-4 text-sm text-gray-400">
            or click to browse (max {maxFiles} files)
          </p>
          <Button
            onClick={() => !disabled && inputRef.current?.click()}
            className="hover:bg-accent text-accent-black mt-2 border border-gray-200 bg-white hover:text-white"
            disabled={disabled}
          >
            Select Files
          </Button>
        </div>
      </div>

      {/* Drag and drop event handlers */}
      {dragActive && !disabled && (
        <div
          className="absolute inset-0 z-10"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        ></div>
      )}
    </>
  );
}
