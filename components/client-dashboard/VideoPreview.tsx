import { Trash2 } from "lucide-react";
import { FileMetadata, FileWithPreview } from "@/types/video";
import Image from "next/image";

interface VideoPreviewProps {
  file: FileWithPreview;
  metadata: FileMetadata;
  onRemove: (id: string) => void;
  onMetadataChange: (
    id: string,
    field: "title" | "description",
    value: string,
  ) => void;
}

export function VideoPreview({
  file,
  metadata,
  onRemove,
  onMetadataChange,
}: VideoPreviewProps) {
  const isVideo = file.type.startsWith("video/");

  return (
    <div className="bg-card w-72 flex-shrink-0 overflow-hidden rounded-md border border-gray-300">
      <div className="relative">
        <div className="relative aspect-video">
          {isVideo ? (
            <video
              src={file.preview}
              className="h-full w-full object-cover"
              controls
            />
          ) : (
            <Image
              src={file.preview}
              alt="Preview"
              className="object-cover"
              fill
            />
          )}
        </div>
        <button
          className="absolute top-2 right-2 grid h-7 w-7 place-content-center rounded-md bg-red-600 duration-200 hover:bg-red-600/80"
          onClick={() => onRemove(file.id)}
        >
          <Trash2 className="h-4 w-4 text-white" />
        </button>
      </div>

      <div className="flex flex-col gap-2 p-3">
        <p className="text-xs font-medium">Add Notes</p>
        <textarea
          value={metadata.description}
          onChange={(e) =>
            onMetadataChange(file.id, "description", e.target.value)
          }
          placeholder="Enter description"
          rows={4}
          className="bg-background w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-xs"
        />
      </div>
    </div>
  );
}
