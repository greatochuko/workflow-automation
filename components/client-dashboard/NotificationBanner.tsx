import { useEffect } from "react";
import { XIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface NotificationBannerProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number; // in milliseconds, 0 for no auto-dismiss
  className?: string;
  onDismiss: () => void;
}

export function NotificationBanner({
  message,
  type = "info",
  duration = 5000,
  className,
  onDismiss,
}: NotificationBannerProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onDismiss();
      }, duration);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [duration, onDismiss]);

  if (!message) return null;

  const typeStyles = {
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    error: "bg-red-50 text-red-800 border-red-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
  };

  return (
    <div
      className={twMerge(
        "animate-fade-in flex items-center justify-between rounded-md border p-4",
        typeStyles[type],
        className,
      )}
    >
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={onDismiss}
        className="ml-4 rounded-md p-1 hover:bg-white/20"
        aria-label="Dismiss"
      >
        <XIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
