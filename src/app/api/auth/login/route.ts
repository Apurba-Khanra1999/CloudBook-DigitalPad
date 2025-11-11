import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/db";
import { signSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email: string = (body?.email || "").toLowerCase().trim();
    const password: string = body?.password || "";

    if (!email || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = signSession({ uid: user.id, email: user.email });
    const res = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
    res.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: "Login failed", detail: e?.message }, { status: 500 });
  }
}