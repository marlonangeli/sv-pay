import { redirect } from "next/navigation";
import DashboardPage from "@/components/pages/dashboard-page.tsx";
import {getUserIdFromServer} from "@/lib/cookies.ts";


export default async function DashboardServer() {
  const userId = await getUserIdFromServer();

  if (!userId) {
    redirect("/");
  }

  return <DashboardPage userId={userId} />;
}
