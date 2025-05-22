import UploadVideoButton from "@/components/client-dashboard/UploadVideoButton";
import ToggleSidebarButton from "@/components/sidebar/ToggleSidebarButton";
import { getSession } from "@/services/authServices";

export default async function Home() {
  const { data: user } = await getSession();

  return (
    <main className="flex-1">
      <div className="flex items-center justify-between border-b border-gray-200 px-[5%] py-4">
        <h1 className="text-xl font-bold capitalize md:text-2xl xl:text-[28px]">
          <ToggleSidebarButton />
          {user?.role.toLocaleLowerCase()} Dashboard
        </h1>
        <UploadVideoButton videoTypes={user?.videoTypes || []} />
      </div>
      <div className="mx-auto w-[90%] max-w-7xl"></div>
    </main>
  );
}
