import LoginForm from "@/components/auth/LoginForm";
import { FileVideo } from "lucide-react";

export default async function LoginPage() {
  return (
    <main className="from-accent/10 flex flex-1 items-center justify-center bg-gradient-to-b to-white">
      <div className="mx-auto flex w-[90%] max-w-md flex-col gap-y-8 rounded-xl bg-white px-4 py-6 shadow-lg sm:px-8 sm:py-8">
        <div className="flex flex-col gap-y-2 text-center">
          <div className="flex items-center justify-center">
            <div className="bg-accent rounded-full p-3">
              <FileVideo className="h-7 w-7 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">VidLeads</h1>
          <p className="text-gray-500">Sign in to your account</p>
        </div>

        <LoginForm />

        <button className="cursor-pointer text-sm hover:underline">
          Forgot password?
        </button>
      </div>
    </main>
  );
}
