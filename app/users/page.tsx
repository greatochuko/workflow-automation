import ToggleSidebarButton from "@/components/sidebar/ToggleSidebarButton";
import UserManagementPageContent from "@/components/userManagement/UserManagementPageContent";
import { getNonAdminUsers } from "@/services/userServices";

export default async function UserManagementPage() {
  const { data: users } = await getNonAdminUsers();

  return (
    <main className="flex-1">
      <div className="flex items-center justify-between border-b border-gray-200 px-[5%] py-4">
        <h1 className="text-xl font-bold md:text-2xl xl:text-[28px]">
          <ToggleSidebarButton />
          User Management
        </h1>
      </div>
      <UserManagementPageContent users={users} />
    </main>
  );
}
