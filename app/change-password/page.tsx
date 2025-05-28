import SetNewPasswordForm from "@/components/auth/SetNewPasswordForm";
import { LockIcon } from "lucide-react";

export default async function ChangePasswordPage() {
  return (
    <main className="from-accent/10 flex flex-1 items-center justify-center bg-gradient-to-b to-white">
      <div className="mx-auto flex w-[90%] max-w-md flex-col gap-y-6 rounded-xl bg-white px-4 py-6 shadow-lg sm:px-6">
        <div className="flex flex-col gap-y-2 text-center">
          <div className="flex items-center justify-center">
            <div className="bg-accent rounded-full p-3">
              <LockIcon className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Change Your Password</h1>
          <p className="text-sm text-gray-500">
            Welcome! Please set a new password to secure your account.
          </p>
        </div>

        <SetNewPasswordForm />
      </div>
    </main>
  );
}
