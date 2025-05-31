"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ImageIcon, VideoIcon } from "lucide-react";

export default function ProjectThumbnail({
  file,
  type = "primary",
}: {
  file?: { type: string; thumbnailUrl: string; name: string } | null;
  type?: "primary" | "small";
}) {
  const [loaded, setLoaded] = useState(false);
  const isValidImageUrl =
    file?.thumbnailUrl?.startsWith("/") ||
    file?.thumbnailUrl?.startsWith("http");

  const styles =
    type === "primary"
      ? {
          wrapper: "aspect-video max-h-[112px] w-full",
          image: "aspect-video max-h-[112px] w-full bg-gray-200 object-cover",
          fallback:
            "flex aspect-video max-h-[112px] w-full items-center justify-center self-start bg-gray-200",
        }
      : {
          wrapper: "aspect-video w-24",
          image:
            "aspect-video w-24 rounded-md border border-gray-300 object-cover",
          fallback:
            "flex aspect-video w-24 items-center justify-center self-start rounded-md border border-gray-300",
        };

  if (isValidImageUrl) {
    return (
      <>
        {!loaded && (
          <span className={styles.fallback}>
            {file?.type?.startsWith("image/") ? (
              <ImageIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <VideoIcon className="h-5 w-5 text-gray-500" />
            )}
          </span>
        )}

        <Image
          src={file?.thumbnailUrl || ""}
          alt={file?.name || ""}
          width={type === "primary" ? 256 : 96}
          height={type === "primary" ? 256 : 96}
          className={`${styles.image} ${loaded ? "block" : "hidden"}`}
          onLoad={() => setLoaded(true)}
        />
      </>
    );
  }

  return (
    <span className={styles.fallback}>
      {file?.type?.startsWith("image/") ? (
        <ImageIcon className="h-5 w-5 text-gray-500" />
      ) : (
        <VideoIcon className="h-5 w-5 text-gray-500" />
      )}
    </span>
  );
}
