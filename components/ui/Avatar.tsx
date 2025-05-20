"use client";

import { type UserType } from "@/types/user";
import Image from "next/image";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

export default function Avatar({
  user,
  className = "",
}: {
  user: UserType;
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
      {user.profilePicture ? (
        <Image
          src={user.profilePicture}
          alt={user.fullName}
          className={imageLoaded ? "" : "invisible"}
          fill
          sizes="128px"
          onLoad={() => setImageLoaded(true)}
        />
      ) : (
        <div className="absolute flex h-full w-full items-center justify-center bg-gray-200 text-sm font-medium text-neutral-700">
          {user.fullName
            .split(" ")
            .slice(0, 2)
            .map((n) => n[0])
            .join("")}
        </div>
      )}
    </div>
  );
}
