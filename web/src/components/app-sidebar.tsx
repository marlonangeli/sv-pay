'use client'

import * as React from "react"
import {Banknote, CirclePlus, Home, PiggyBank,} from "lucide-react"

import {NavMain, NavMainProps} from "@/components/nav-main"
import {NavUser} from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {Account, useGetUserById} from "@/http/generated";
import Link from "next/link";

export function AppSidebar({userId, ...props}: { userId: string } & React.ComponentProps<typeof Sidebar>) {

  const {data: user, isPending} = useGetUserById({userId: userId!}, {
    query: {
      select: (response) => response.data
    }
  });

  if (isPending)
    return (
      <Sidebar variant="inset" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <div>
                  <div
                    className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Banknote className="size-4"/>
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-bold">SV Pay</span>
                    <span className="truncate text-xs">Payments</span>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
      </Sidebar>
    );

  const navMain = {
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
        isActive: true,
      },
      {
        title: "Accounts",
        icon: PiggyBank,
        isActive: !isPending,
        items: user!.accounts?.map((account: Account) => {
          return {
            key: account.id,
            title: account.name,
            url: `/account/${account.id}`,
          };
        }) || [],
      },
      {
        title: "Create",
        icon: CirclePlus,
        isActive: true,
        items: [
          {
            key: "new-account",
            title: "Account",
            url: "/account/new",
          },
          {
            key: "new-transaction",
            title: "Transaction",
            url: "/transaction/new",
          },
        ],
      }
    ],
  } as NavMainProps;

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={"/"}>
                <div
                  className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Banknote className="size-4"/>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold">SV Pay</span>
                  <span className="truncate text-xs">Payments</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain.items}/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user!}/>
      </SidebarFooter>
    </Sidebar>
  )
}
