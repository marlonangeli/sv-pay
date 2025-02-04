'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import React from "react";
import {usePathname} from "next/navigation";

export default function AppBreadcrumb() {

  const pathName = usePathname();
  let currentPage: string | undefined;
  if (pathName === "/dashboard"){
    currentPage = undefined;
  }
  else {
    currentPage = pathName.split("/").at(1);
    currentPage = currentPage!.replace(/-/g, " ").replace("/", "").replace(/\b\w/g, (c) => c.toUpperCase());
  }

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