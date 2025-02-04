import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {Search} from "lucide-react";
import React from "react";
import {SearchUserForm} from "@/components/user/search-user-form";
import {SearchUserResult} from "@/components/user/search-user-result";
import {setUserIdCookieInServer} from "@/lib/cookies";
import {redirect} from "next/navigation";

export function SearchUserSheet() {
  const [searchResult, setSearchResult] = React.useState<{
    user?: {
      id: string;
      name: string;
      email: string;
      cpf: string;
      initials: string;
    };
    error?: string;
  }>({});

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Search className="mr-2 h-4 w-4"/>
          Search User
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="mb-6">
          <SheetTitle>Search User</SheetTitle>
        </SheetHeader>
        <SearchUserForm onUserFound={(user) => setSearchResult({
          user: {
            id: user.id!,
            name: user.fullName!,
            cpf: user.cpf!.formattedValue!,
            email: user.email!,
            initials: user.fullName!.split(' ').map((n) => n[0]).join('') || user.fullName!.slice(0, 2).toUpperCase()
          }
        })}
                        onError={(error) => setSearchResult({error: error.errors ? error.errors.map(e => e.description).join(", ") : error.detail!})}/>
        {(searchResult.user || searchResult.error) && (
          <SearchUserResult user={searchResult.user} error={searchResult.error} onClick={async () => {
            if (searchResult.user) {
              await setUserIdCookieInServer(searchResult.user.id);
            }
            redirect('/dashboard',);
          }}/>
        )}
      </SheetContent>
    </Sheet>
  );
}