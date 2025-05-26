import ProfileForm from "@/components/profile/ProfileForm";
import ToggleSidebarButton from "@/components/sidebar/ToggleSidebarButton";
import { getSession } from "@/services/authServices";
import React from "react";

export default async function page() {
  const { data: user } = await getSession();

  return (
    <main className="w-full flex-1">
      <div className="flex flex-col border-b border-gray-200 px-[5%] py-4">
        <h1 className="flex text-lg font-bold capitalize sm:text-xl md:text-2xl xl:text-[28px]">
          <ToggleSidebarButton />
          Profile
        </h1>
        <p className="text text-gray-500">
          View and update your profile information
        </p>
      </div>
      <div className="mx-auto flex w-[90%] max-w-7xl flex-col gap-6 py-4">
        {user && <ProfileForm user={user} />}
      </div>
    </main>
  );
}
