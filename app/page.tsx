import ClientDashboardContent from "@/components/client-dashboard/ClientDashboardContent";
import FreelancerDashboardContent from "@/components/freelancer-dashboard/FreelancerDashboardContent";
import { getSession } from "@/services/authServices";
import {
  getClientProjects,
  getFreelancerClientProjects,
} from "@/services/projectServices";

export default async function Home() {
  const { data: user } = await getSession();
  const { data: projects } =
    user?.role === "CLIENT"
      ? await getClientProjects(user.id)
      : await getFreelancerClientProjects(
          user?.assignedClients.map((cl) => cl.id) || [],
        );

  return (
    <main className="w-full flex-1">
      {user?.role === "CLIENT" ? (
        <ClientDashboardContent
          clientVideoTypes={user?.videoTypes || []}
          projects={projects}
        />
      ) : (
        <FreelancerDashboardContent projects={projects} />
      )}
    </main>
  );
}
