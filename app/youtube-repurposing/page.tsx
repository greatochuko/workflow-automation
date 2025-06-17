import YoutubeRepurposingPageContent from "@/components/youtube-repurposing/YoutubeRepurposingPageContent";
import { getSession } from "@/services/authServices";
import { getClientApprovedProjects } from "@/services/projectServices";
import React from "react";

export default async function Page() {
  const { data: user } = await getSession();

  const { data: projects } = await getClientApprovedProjects(user?.id);

  return <YoutubeRepurposingPageContent projects={projects} />;
}
