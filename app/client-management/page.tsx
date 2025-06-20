import ToggleSidebarButton from "@/components/sidebar/ToggleSidebarButton";
import Avatar from "@/components/ui/Avatar";
import { getClients } from "@/services/userServices";
import Link from "next/link";

export default async function UserManagementPage() {
  const { data: clients } = await getClients();

  return (
    <main className="flex-1">
      <div className="flex items-center justify-between border-b border-gray-200 px-[5%] py-4">
        <h1 className="flex text-xl font-bold md:text-2xl xl:text-[28px]">
          <ToggleSidebarButton />
          Client Management
        </h1>
      </div>
      <div className="mx-auto flex w-[90%] max-w-7xl flex-col gap-6 py-4">
        <div className="grid gap-4 min-[480px]:grid-cols-2 sm:grid-cols-[repeat(auto-fill,_minmax(240px,_1fr))]">
          {clients.map((client) => (
            <div
              key={client.id}
              className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4 shadow-md duration-200"
            >
              <Avatar user={client} className="h-20 w-20" />
              <div className="flex flex-1 flex-col items-center text-center">
                <h2 className="text-lg font-semibold">{client.fullName}</h2>
                <p className="text-sm text-gray-500">{client.companyName}</p>
              </div>
              <div className="mt-2 flex w-full flex-col gap-2">
                <Link
                  href={`/client-management/${client.id}/dashboard`}
                  className="hover:bg-accent rounded-md border border-gray-200 px-4 py-2 text-center text-sm font-medium duration-150 hover:text-white"
                >
                  Client Dashboard
                </Link>
                <Link
                  href={`/client-management/${client.id}/newsletter-content`}
                  className="hover:bg-accent rounded-md border border-gray-200 px-4 py-2 text-center text-sm font-medium duration-150 hover:text-white"
                >
                  Newsletter Content
                </Link>
                <Link
                  href={`/client-management/${client.id}/script-generator`}
                  className="hover:bg-accent rounded-md border border-gray-200 px-4 py-2 text-center text-sm font-medium duration-150 hover:text-white"
                >
                  Script Generator
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
