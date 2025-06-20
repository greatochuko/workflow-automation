import React from "react";
import ToggleSidebarButton from "@/components/sidebar/ToggleSidebarButton";
import { getVideoScriptById } from "@/services/scriptServices";
import { notFound } from "next/navigation";
import Link from "next/link";
import ScriptEditingForm from "@/components/script-generator/ScriptEditingForm";
import { ArrowLeftIcon } from "lucide-react";

export default async function Page({
  params,
}: {
  params: Promise<{ scriptId: string; id: string }>;
}) {
  const { scriptId, id: clientId } = await params;

  const { data: videoScript } = await getVideoScriptById(scriptId);

  if (!videoScript) notFound();

  return (
    <main className="flex w-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 px-[5%] py-4">
        <div className="flex flex-col">
          <h1 className="flex items-center text-lg font-bold capitalize sm:text-xl md:text-2xl xl:text-[28px]">
            <ToggleSidebarButton />
            Script Details
          </h1>
          <p className="text-sm text-gray-500">
            View and manage the details of your script.
          </p>
        </div>
        <Link
          href={
            clientId
              ? `/client-management/${clientId}/script-generator`
              : "/script-generator"
          }
          className="hover:bg-accent hover:border-accent flex items-center gap-2 rounded-md border border-gray-300 p-2 px-4 text-sm duration-200 hover:text-white"
        >
          <ArrowLeftIcon className="h-4 w-4" /> Back
        </Link>
      </div>
      <div className="mx-auto flex w-[90%] max-w-7xl flex-col gap-6 py-4">
        <div className="flex h-fit items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Your Generated Script</h2>
          <Link
            href={
              clientId
                ? `/client-management/${clientId}/script-generator`
                : "/script-generator"
            }
            className="hover:bg-accent rounded-md border border-gray-200 px-4 py-2 text-sm font-medium duration-200 hover:text-white"
          >
            Generate New Script
          </Link>
        </div>
        <ScriptEditingForm videoScript={videoScript} />
      </div>
    </main>
  );
}
