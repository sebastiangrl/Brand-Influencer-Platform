// src/app/api/auth/session/route.ts
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  return NextResponse.json({
    authenticated: !!session,
    session
  });
}