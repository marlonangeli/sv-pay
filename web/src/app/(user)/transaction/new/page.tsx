import {getUserIdFromServer} from "@/lib/cookies";
import {redirect} from "next/navigation";
import CreateTransactionPage from "@/components/pages/new-transaction-page";

export default async function CreateTransactionServer() {
  const userId = await getUserIdFromServer();

  if (!userId) {
    redirect("/");
  }

  return <CreateTransactionPage userId={userId}/>;
}