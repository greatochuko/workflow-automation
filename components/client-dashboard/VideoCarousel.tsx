import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FileWithPreview } from "@/types/video";
import { VideoPreview } from "./VideoPreview";

interface VideoCarouselProps {
  files: FileWithPreview[];
  onRemove: (id: string) => void;
  onMetadataChange: (
    id: string,
    field: "title" | "description",
    value: string,
  ) => void;
}

export function VideoCarousel({
  files,
  onRemove,
  onMetadataChange,
}: VideoCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const newPosition = Math.max(0, scrollPosition - 300);
      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
      setScrollPosition(newPosition);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const newPosition = scrollPosition + 300;
      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
      setScrollPosition(newPosition);
    }
  };

  if (files.length === 0) return null;

  return (
    <div className="relative">
      {files.length > 0 && (
        <>
          <button
            className="bg-background text-foreground hover:bg-accent hover:border-accent absolute top-1/2 -left-4 z-10 -translate-y-1/2 transform rounded-md border border-gray-300 p-2.5 duration-200 hover:text-white"
            onClick={scrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            className="bg-background text-foreground hover:bg-accent hover:border-accent absolute top-1/2 -right-4 z-10 -translate-y-1/2 transform rounded-md border border-gray-300 p-2.5 duration-200 hover:text-white"
            onClick={scrollRight}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}

      <div
        ref={scrollContainerRef}
        className="hide-scrollbar flex space-x-4 overflow-x-auto px-1"
        style={{ scrollBehavior: "smooth" }}
      >
        {files.map((file) => (
          <VideoPreview
            key={file.metadata.id}
            file={file}
            metadata={file.metadata}
            onRemove={onRemove}
            onMetadataChange={onMetadataChange}
          />
        ))}
      </div>
    </div>
  );
}
