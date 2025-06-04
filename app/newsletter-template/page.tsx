import ClientNewsletterTemplatePageContent from "@/components/newsletter-template/ClientNewsletterTemplatePageContent";
import { getSession } from "@/services/authServices";
import { getClientApprovedProjects } from "@/services/projectServices";
import React from "react";

export default async function Page() {
  const { data: user } = await getSession();

  const { data: projects } = await getClientApprovedProjects(user?.id);

  console.log(user?.creditsUsedThisMonth);

  return (
    <ClientNewsletterTemplatePageContent
      projects={projects}
      creditsUsedThisMonth={user?.creditsUsedThisMonth || 0}
    />
  );
}
