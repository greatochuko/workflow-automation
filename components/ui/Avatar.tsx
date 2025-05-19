"use client";

import { User } from "@prisma/client";
import Image from "next/image";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

export default function Avatar({
  user,
  className = "",
}: {
  user: User;
  className?: string;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className={twMerge("relative overflow-hidden rounded-full", className)}
    >
      {!imageLoaded && (
        <div className="absolute flex h-full w-full items-center justify-center bg-gray-200 text-sm font-medium text-neutral-700">
          {user.fullName
            .split(" ")
            .slice(0, 2)
            .map((n) => n[0])
            .join("")}
        </div>
      )}
      <Image
        src={user.profilePicture || "/placeholder-profile-picture.jpg"}
        alt={user.fullName}
        className={imageLoaded ? "" : "invisible"}
        fill
        sizes="128px"
        onLoad={() => setImageLoaded(true)}
      />
    </div>
  );
}
