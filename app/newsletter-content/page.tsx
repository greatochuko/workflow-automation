import ClientNewsletterPageContent from "@/components/newsletter-content/ClientNewsletterPageContent";
import { getSession } from "@/services/authServices";
import { getClientApprovedProjects } from "@/services/projectServices";
import React from "react";

export default async function Page() {
  const { data: user } = await getSession();

  const { data: projects } = await getClientApprovedProjects(user?.id);

  return (
    <ClientNewsletterPageContent
      projects={projects}
      creditsUsedThisMonth={user?.creditsUsedThisMonth || 0}
      totalCredits={user?.monthlyCredits || 2}
    />
  );
}
