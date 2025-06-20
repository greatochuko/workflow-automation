import ToggleSidebarButton from "@/components/sidebar/ToggleSidebarButton";
import YoutubeRepurposingPageContent from "@/components/youtube-repurposing/YoutubeRepurposingPageContent";
import { getClientApprovedProjects } from "@/services/projectServices";
import React from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: clientId } = await params;

  const { data: projects } = await getClientApprovedProjects(clientId);

  return (
    <main className="flex w-full flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-[5%] py-4">
        <div className="flex flex-col">
          <h1 className="flex items-center text-lg font-bold capitalize sm:text-xl md:text-2xl xl:text-[28px]">
            <ToggleSidebarButton />
            YouTube Shorts Repurposing
          </h1>
          <p className="text-sm text-gray-500">
            Transform your Instagram content into YouTube-ready videos
          </p>
        </div>
      </div>
      <YoutubeRepurposingPageContent projects={projects} />
    </main>
  );
}
