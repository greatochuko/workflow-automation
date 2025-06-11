import ClientDashboardContent from "@/components/client-dashboard/ClientDashboardContent";
import { getClientProjects } from "@/services/projectServices";
import { getUserById } from "@/services/userServices";
import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: clientId } = await params;
  const { data: user } = await getUserById(clientId);
  const { data: projects } = await getClientProjects(user?.id || "");

  return (
    <main className="w-full flex-1">
      <ClientDashboardContent
        clientVideoTypes={user?.videoTypes || []}
        clientVideoScripts={user?.videoScripts || []}
        projects={projects}
      />
    </main>
  );
}
