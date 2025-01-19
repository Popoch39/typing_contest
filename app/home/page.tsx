import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import TestGame from "@/components/testGame";

export default async function () {
  const session = await getServerSession(authOptions);

  return <></>;
}
