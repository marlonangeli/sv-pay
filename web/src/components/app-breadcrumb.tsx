'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb.tsx";
import React from "react";
import {usePathname} from "next/navigation";

export default function AppBreadcrumb() {

  const pathName = usePathname();
  let currentPage;
  if (pathName === "/dashboard") currentPage = undefined;
  else currentPage = pathName.replace(/-/g, " ").replace("/", "").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/dashboard">
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        {currentPage &&
          (<><BreadcrumbSeparator className="hidden md:block"/><BreadcrumbItem>
            <BreadcrumbPage>{currentPage}</BreadcrumbPage>
          </BreadcrumbItem></>)}
      </BreadcrumbList>
    </Breadcrumb>);
}