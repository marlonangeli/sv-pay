import {Logo} from "@/components/logo.tsx";
import {Button} from "@/components/ui/button.tsx";
import {UserPlus} from "lucide-react";
import React from "react";
import {redirect, RedirectType} from "next/navigation";
import {SearchUserSheet} from "@/components/user/search-user-sheet.tsx";

export default function AppHeader() {

  return (
    <header className="border-b fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Logo/>
        <div className="flex gap-4">
          <SearchUserSheet/>
          <Button onClick={() => redirect("/new-user", RedirectType.push)}>
            <UserPlus className="mr-2 h-4 w-4"/>
            Create User
          </Button>
        </div>
      </div>
    </header>
  )

}