import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import TestGame from "@/components/testGame";

export const dynamic = "force-dynamic";
export default async function () {
  const session = await getServerSession(authOptions);

  return (
    <div className="h-full w-full flex justify-center items-start p-3">
      <TestGame />
    </div>
  );
}
