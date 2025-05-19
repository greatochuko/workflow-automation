"use client";

import { createContext, PropsWithChildren, useState } from "react";

export const SidebarContext = createContext<{
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export default function SidebarProvider({ children }: PropsWithChildren) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}
