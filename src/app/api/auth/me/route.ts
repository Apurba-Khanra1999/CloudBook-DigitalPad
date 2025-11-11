import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
  const payload = verifySession(token);
  if (!payload) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
  const rows = await sql`SELECT id, name, email FROM users WHERE id = ${payload.uid} LIMIT 1`;
  const user = rows[0] || null;
  return NextResponse.json({ user });
}