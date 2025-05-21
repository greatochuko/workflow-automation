import ToggleSidebarButton from "@/components/sidebar/ToggleSidebarButton";
import AdminSettingsPageContent from "@/components/settings/AdminSettingsPageContent";
import { getClients } from "@/services/userServices";
import { getVideoTypes } from "@/services/videoTypeServices";

export default async function UserManagementPage() {
  const { data: clients } = await getClients();
  const { data: videoTypes } = await getVideoTypes();

  return (
    <main className="flex-1">
      <div className="flex items-center justify-between border-b border-gray-200 px-[5%] py-4">
        <h1 className="text-xl font-bold md:text-2xl xl:text-[28px]">
          <ToggleSidebarButton />
          Admin Settings
        </h1>
      </div>
      <AdminSettingsPageContent clients={clients} videoTypes={videoTypes} />
    </main>
  );
}
