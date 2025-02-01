'use client'

import {AppSidebar} from "@/components/app-sidebar.tsx";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import React from "react";
import AppBreadcrumb from "@/components/app-breadcrumb.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {useRouter} from "next/navigation";

export default function DashboardLayout({children}: Readonly<{ children: React.ReactNode; }>) {

  const queryClient = new QueryClient();
  const router = useRouter();
  const userId = localStorage.getItem("userId");
  if (!userId)
    router.push("/");

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <AppSidebar/>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 sticky top-0 z-10 bg-background rounded-t-2xl shadow-sm px-4">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1"/>
              <Separator orientation="vertical" className="mr-2 h-4"/>
              <AppBreadcrumb/>
            </div>
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </QueryClientProvider>
  );
}
