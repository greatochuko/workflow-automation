import { VideoScriptType } from "@/types/videoScript";
import { format } from "date-fns";
import Link from "next/link";
import React from "react";

export default function GeneratedScriptList({
  videoScripts,
}: {
  videoScripts: VideoScriptType[];
}) {
  return (
    <div className="flex max-h-[calc(100vh-117px)] min-w-[340px] flex-1 flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:gap-6 sm:p-6">
      <h2 className="text-lg font-semibold sm:text-xl">Your Scripts</h2>

      {videoScripts.length > 0 ? (
        <ul className="flex flex-1 flex-col gap-4 overflow-y-auto">
          {videoScripts.map((script) => (
            <li key={script.id}>
              <Link
                href={`/script-generator/${script.id}`}
                className="flex flex-col gap-0.5 rounded-lg border border-gray-200 p-4 text-sm duration-200 hover:border-gray-400 hover:bg-gray-50"
              >
                <h3 className="font-medium">{script.topic}</h3>
                <p className="line-clamp-1 text-sm whitespace-pre-line text-gray-500">
                  {script.content.body}
                </p>
                <p className="line-clamp-1 text-xs text-gray-500">
                  {format(new Date(script.createdAt), "MMMM d")}
                  {" • "}
                  {script.durationInSeconds} seconds
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-8 text-center text-sm text-gray-500">
          You have not generated any scripts yet
        </p>
      )}
    </div>
  );
}
