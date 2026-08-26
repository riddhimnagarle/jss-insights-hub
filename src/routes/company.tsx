import { Outlet, createFileRoute } from "@tanstack/react-router";

import { AppSidebar } from "@/components/AppSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { COLLEGE_SHORT } from "@/config/college";
import { useCompany } from "@/context/CompanyContext";

export const Route = createFileRoute("/company")({
  component: AppLayout,
});

function AppLayout() {
  const { summary } = useCompany();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-card">
        <header className="flex h-14 items-center gap-2 border-b border-border bg-card px-3 sm:px-4">
          <SidebarTrigger className="md:hidden" />
          <nav
            aria-label="Breadcrumb"
            className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground"
          >
            <span>{COLLEGE_SHORT}</span>
            <span aria-hidden="true">/</span>
            <span className="truncate font-medium text-foreground">
              {summary?.name ?? "Company"}
            </span>
          </nav>
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
