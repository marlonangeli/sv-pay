'use client'

import * as React from "react"
import {Banknote, Home, PiggyBank, HeartHandshake, Settings2,} from "lucide-react"

import {NavMain, NavMainProps} from "@/components/nav-main"
import {NavUser, NavUserProps} from "@/components/nav-user"
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
import {NavSecondary, NavSecondaryProps} from "@/components/nav-secondary";

export function AppSidebar({userId, ...props}: { userId: string } & React.ComponentProps<typeof Sidebar>) {

  const {data, isPending} = useGetUserById({userId: userId!});

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

  const user = data?.data || {};

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
        items: user.accounts?.map((account: Account) => {
          return {
            title: account.name,
            url: `/account/${account.id}`,
          };
        }) || [],
      },
      {
        title: "Settings",
        icon: Settings2,
        isActive: true,
        items: [
          {
            title: "New Account",
            url: "/account/new",
          },
          {
            title: "New Transaction",
            url: "/transaction/new",
          },
        ],
      }
    ],
  } as NavMainProps;

  const navUser = {
    user: {
      name: user.fullName,
      email: user.email,
      initials: user.firstName!.charAt(0) + user.lastName!.charAt(0),
    }
  } as NavUserProps;

  const navSecondary = {
    items: [
      {
        title: "Thanks",
        url: "/thanks",
        icon: HeartHandshake,
      },
    ],
  } as NavSecondaryProps;


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
        <NavSecondary items={navSecondary.items} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navUser.user}/>
      </SidebarFooter>
    </Sidebar>
  )
}
