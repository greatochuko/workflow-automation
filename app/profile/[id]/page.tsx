import ProfileDetails from "@/components/profile/ProfileDetails";
import ToggleSidebarButton from "@/components/sidebar/ToggleSidebarButton";
import { getUserById } from "@/services/userServices";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: user } = await getUserById(id);

  return (
    <main className="w-full flex-1">
      <div className="flex justify-between border-b border-gray-200 px-[5%] py-4">
        <h1 className="flex text-lg font-bold capitalize sm:text-xl md:text-2xl xl:text-[28px]">
          <ToggleSidebarButton />
          {user ? `${user.fullName.split(" ")[0]}'s` : null} Profile
        </h1>
        <Link
          href={"/users"}
          className="flex items-center gap-2 hover:underline"
        >
          <ArrowLeftIcon className="h-4 w-4" /> Back
        </Link>
      </div>
      <div className="mx-auto flex w-[90%] max-w-7xl flex-col gap-6 py-4">
        {user && (
          <>
            <ProfileDetails user={user} />
          </>
        )}
      </div>
    </main>
  );
}
