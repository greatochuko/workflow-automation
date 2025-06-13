"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      className="bg-accent-black hover:bg-accent-black/90 flex items-center gap-2 rounded-full px-8 py-3 font-medium text-white"
      onClick={() => router.back()}
    >
      <ArrowLeft className="h-5 w-5" />
      Go Back
    </button>
  );
}
