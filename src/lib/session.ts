import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";

export async function getCurrentSession(): Promise<Session | null> {
  const session = await getServerSession(authOptions);
  return session;
}

export async function getCurrentUser() {
  const session = await getCurrentSession();
  return session?.user;
}