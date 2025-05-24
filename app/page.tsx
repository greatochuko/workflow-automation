import ContentCalendar from "@/components/client-dashboard/ContentCalendar";
import UploadVideoButton from "@/components/client-dashboard/UploadVideoButton";
import ToggleSidebarButton from "@/components/sidebar/ToggleSidebarButton";
import { getSession } from "@/services/authServices";
import { getClientProjects } from "@/services/projectServices";
import { ProjectType } from "@/types/project";

export default async function Home() {
  const { data: user } = await getSession();
  const { data: projects } = user
    ? await getClientProjects(user.id)
    : { data: [] };

  return (
    <main className="flex-1">
      <div className="flex items-center justify-between border-b border-gray-200 px-[5%] py-4">
        <h1 className="text-xl font-bold capitalize md:text-2xl xl:text-[28px]">
          <ToggleSidebarButton />
          {user?.role.toLocaleLowerCase()} Dashboard
        </h1>
        {user?.role === "CLIENT" && (
          <UploadVideoButton videoTypes={user?.videoTypes || []} />
        )}
      </div>
      <ContentCalendar projects={projects as ProjectType[]} />
    </main>
  );
}
