import {redirect} from "next/navigation";
import DashboardPage from "@/components/pages/dashboard-page";
import {getUserIdFromServer} from "@/lib/cookies";


export default async function DashboardServer() {
  const userId = await getUserIdFromServer();

  if (!userId) {
    redirect("/");
  }

  return <DashboardPage userId={userId}/>;
}
