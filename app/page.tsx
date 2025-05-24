import ClientDashboardContent from "@/components/client-dashboard/ClientDashboardContent";
import { getSession } from "@/services/authServices";
import { getClientProjects } from "@/services/projectServices";

export default async function Home() {
  const { data: user } = await getSession();
  const { data: projects } = user
    ? await getClientProjects(user.id)
    : { data: [] };

  return (
    <main className="flex-1">
      {user?.role === "CLIENT" ? (
        <ClientDashboardContent
          clientVideoTypes={user?.videoTypes || []}
          projects={projects}
        />
      ) : null}
    </main>
  );
}
