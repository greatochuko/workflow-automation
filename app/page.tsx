import ClientDashboardContent from "@/components/client-dashboard/ClientDashboardContent";
import FreelancerDashboardContent from "@/components/freelancer-dashboard/FreelancerDashboardContent";
import { getSession } from "@/services/authServices";
import {
  getClientProjects,
  getFreelancerClientProjects,
} from "@/services/projectServices";
import { getFreelancerClients } from "@/services/userServices";
import { UserType } from "@/types/user";

export default async function Home() {
  const { data: user } = await getSession();
  const { data: projects } =
    user?.role === "CLIENT"
      ? await getClientProjects(user.id)
      : await getFreelancerClientProjects(
          user?.assignedClients.map((cl) => cl.id) || [],
        );

  let clients: UserType[] = [];

  if (user?.role === "FREELANCER") {
    const { data } = await getFreelancerClients(user.id);
    clients = data;
  }

  return (
    <main className="w-full flex-1">
      {user?.role === "CLIENT" ? (
        <ClientDashboardContent
          clientVideoTypes={user?.videoTypes || []}
          clientVideoScripts={user?.videoScripts || []}
          projects={projects}
          permission="FULL"
        />
      ) : (
        <FreelancerDashboardContent projects={projects} clients={clients} />
      )}
    </main>
  );
}
