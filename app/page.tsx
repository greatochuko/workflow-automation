import LogoutButton from "@/components/auth/LogoutButton";
import { getUser } from "@/services/authServices";
import { redirect } from "next/navigation";

export default async function Home() {
  const { data: user } = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className=" w-full">
      <div className="flex justify-between p-4">
        <h1>
          Hello,{" "}
          <span className="font-semibold">{user.fullName.split(" ")[0]}</span>
          {". "}
          You are an {user.role}
        </h1>
        <LogoutButton />
      </div>
    </main>
  );
}
