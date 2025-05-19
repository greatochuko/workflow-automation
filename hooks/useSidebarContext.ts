import { SidebarContext } from "@/context/SidebarContext";
import { useContext } from "react";

export default function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (!context)
    throw new Error("Sidebar context must be used within a sidebar provider");

  return context;
}
