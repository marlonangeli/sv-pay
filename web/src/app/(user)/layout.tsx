import {AppSidebar} from "@/components/app-sidebar.tsx";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import React from "react";
import AppBreadcrumb from "@/components/app-breadcrumb.tsx";
import {redirect} from "next/navigation";
import {getUserIdFromServer} from "@/lib/cookies.ts";

export default async function DashboardLayout({children}: Readonly<{ children: React.ReactNode; }>) {
  const userId = await getUserIdFromServer();

  if (!userId) redirect("/");

  return (
    <SidebarProvider>
      <AppSidebar userId={userId}/>
      <SidebarInset>
        <header
          className="flex h-16 shrink-0 items-center gap-2 sticky top-0 z-10 bg-background rounded-t-2xl shadow-sm px-4">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1"/>
            <Separator orientation="vertical" className="mr-2 h-4"/>
            <AppBreadcrumb/>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
