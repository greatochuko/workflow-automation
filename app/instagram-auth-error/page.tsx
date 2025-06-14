import { UserIcon } from "lucide-react";
import Link from "next/link";

export default function page() {
  return (
    <div className="text-foreground flex min-h-screen flex-1 flex-col items-center justify-center bg-white px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-9xl font-bold text-gray-300">Error</h1>
        <p className="text-foreground text-2xl font-medium">
          Instagram Authentication Failed
        </p>
        <p className="text-gray-500">
          Sorry, we couldn&apos;t authenticate you with Instagram. Please try
          again or use another method.
        </p>
        <Link
          href={"/profile"}
          className="bg-accent-black hover:bg-accent-black/90 flex items-center gap-2 rounded-full px-8 py-3 font-medium text-white"
        >
          <UserIcon className="h-5 w-5" />
          Profile
        </Link>
      </div>
    </div>
  );
}
