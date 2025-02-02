import SessionClientProvider from "@/providers/SessionProvider";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import SideBar from "@/components/SideBar";
import MatchFoundDialog from "@/components/MatchFoundDialog";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return (
    <SessionClientProvider session={session}>
      <SideBar>
        <MatchFoundDialog />
        {children}
      </SideBar>
    </SessionClientProvider>
  );
}

