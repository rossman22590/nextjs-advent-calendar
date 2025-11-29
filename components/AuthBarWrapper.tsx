import { getSession } from "@/lib/auth";
import AuthBarClient from "./AuthBarClient";

export default async function AuthBar() {
  const session = await getSession();
  return <AuthBarClient session={session} />;
}
