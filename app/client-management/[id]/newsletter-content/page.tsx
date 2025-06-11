import ClientNewsletterPageContent from "@/components/newsletter-content/ClientNewsletterPageContent";
import { getClientApprovedProjects } from "@/services/projectServices";
import { getUserById } from "@/services/userServices";
import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: clientId } = await params;
  const { data: user } = await getUserById(clientId);
  const { data: projects } = await getClientApprovedProjects(user?.id || "");

  return (
    <ClientNewsletterPageContent
      projects={projects}
      creditsUsedThisMonth={user?.creditsUsedThisMonth || 0}
      totalCredits={user?.monthlyCredits || 2}
    />
  );
}
