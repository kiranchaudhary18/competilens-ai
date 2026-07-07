import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { Sidebar } from "@/components/app/Sidebar";
import { Topbar } from "@/components/app/Topbar";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground transition-all duration-300">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`transition-all duration-300 ${collapsed ? "lg:pl-20" : "lg:pl-[250px]"}`}>
        <Topbar sidebarCollapsed={collapsed} />
        <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-[1320px] mx-auto">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 6, filter: "blur(6px)" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
