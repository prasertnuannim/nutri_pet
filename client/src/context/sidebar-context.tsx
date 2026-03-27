"use client";

import { createContext, useContext, useEffect, useState } from "react";

type SidebarContextType = {
  open: boolean;
  toggle: () => void;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1279px)");

    const syncSidebarState = (event?: MediaQueryListEvent) => {
      const shouldCollapse = event?.matches ?? mediaQuery.matches;
      setOpen(!shouldCollapse);
    };

    syncSidebarState();
    mediaQuery.addEventListener("change", syncSidebarState);

    return () => mediaQuery.removeEventListener("change", syncSidebarState);
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        open,
        toggle: () => setOpen((p) => !p),
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("SidebarContext missing");
  return ctx;
}
