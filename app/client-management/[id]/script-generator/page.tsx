import React from "react";
import ToggleSidebarButton from "@/components/sidebar/ToggleSidebarButton";
import ScriptGenerationForm from "@/components/script-generator/ScriptGenerationForm";
import GeneratedScriptList from "@/components/script-generator/GeneratedScriptList";
import { getVideoScripts } from "@/services/scriptServices";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: clientId } = await params;

  const { data: videoScripts } = await getVideoScripts(clientId);

  return (
    <main className="flex w-full flex-col">
      <div className="flex flex-col border-b border-gray-200 px-[5%] py-4">
        <h1 className="flex items-center text-lg font-bold capitalize sm:text-xl md:text-2xl xl:text-[28px]">
          <ToggleSidebarButton />
          Script Generator
        </h1>
        <p className="text-sm text-gray-500">
          Generate video scripts for your content
        </p>
      </div>
      <div className="mx-auto flex w-[90%] max-w-7xl flex-1 flex-wrap gap-6 py-4">
        <ScriptGenerationForm userId={clientId} />
        <GeneratedScriptList videoScripts={videoScripts} clientId={clientId} />
      </div>
    </main>
  );
}
