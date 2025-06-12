import BackButton from "@/components/ui/BackButton";

export default function NotFound() {
  return (
    <div className="text-foreground flex min-h-screen flex-1 flex-col items-center justify-center bg-white px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-9xl font-bold text-gray-300">404</h1>
        <p className="text-foreground text-2xl font-medium">Page Not Found</p>
        <p className="text-gray-500">
          Sorry, the page you are looking for doesn&apos;t exist or has been
          moved.
        </p>
        <BackButton />
      </div>
    </div>
  );
}
