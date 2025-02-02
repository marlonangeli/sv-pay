import {getUserIdFromServer} from "@/lib/cookies.ts";
import {redirect} from "next/navigation";
import CreateAccountPage from "@/components/pages/new-account-page.tsx";

export default async function CreateAccountServer() {
  const userId = await getUserIdFromServer();

  if (!userId) {
    redirect("/");
  }

  return <CreateAccountPage userId={userId} />;
}