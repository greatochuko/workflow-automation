import LogoutButton from "@/components/auth/LogoutButton";
import { getUser } from "@/services/authServices";
import { redirect } from "next/navigation";

export default async function Home() {
  const { data: user } = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex-1">
      <div className="flex border-b border-gray-200 py-4">
        <h1 className="mx-auto w-[95%] max-w-7xl text-3xl font-bold">
          Admin Dashboard
        </h1>
      </div>
      <div className="mx-auto w-[90%] max-w-7xl"></div>
    </main>
  );
}
