import AccountPage from "@/components/pages/account-page";
import {getUserIdFromServer} from "@/lib/cookies";
import {redirect} from "next/navigation";
import {getAccountById} from "@/http/generated";
import {Button} from "@/components/ui/button";
import {JSX} from "react";

type PageProps = Promise<{ id: string }>;

export default async function AccountServer({params}: { params: PageProps }): Promise<JSX.Element> {
  const userId = await getUserIdFromServer();
  const {id} = await params;

  if (!userId) {
    redirect("/");
  }

  const {data: account} = await getAccountById({accountId: id});

  if (account.userId !== userId) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-semibold">Unauthorized</h2>
        <p className="text-muted-foreground mt-2">You don&apos;t have permission to view this account.</p>
        <Button asChild className="mt-4">
          <a href="/dashboard">Go Back to Dashboard</a>
        </Button>
      </div>
    )
  }

  return (
    <AccountPage accountId={id}/>
  )
}
