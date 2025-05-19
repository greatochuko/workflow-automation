import { User } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { twMerge } from "tailwind-merge";

export default function Avatar({
  user,
  className = "",
}: {
  user: User;
  className?: string;
}) {
  return (
    <div
      className={twMerge("relative overflow-hidden rounded-full", className)}
    >
      <div className="absolute flex h-full w-full items-center justify-center">
        {user.fullName
          .split(" ")
          .slice(0, 2)
          .map((n) => n[0])
          .join("")}
      </div>
      <Image
        src={user.profilePicture || "/placeholder-profile-picture.jpg"}
        alt={user.fullName}
        fill
      />
      ;
    </div>
  );
}
