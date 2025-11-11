import { NextResponse } from "next/server";
import { initUserSchema, getUserByEmail, createUser } from "@/lib/db";
import { signSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await initUserSchema();
    const body = await req.json();
    const name: string = (body?.name || "").trim();
    const email: string = (body?.email || "").toLowerCase().trim();
    const password: string = body?.password || "";

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser(name, email, passwordHash);
    const token = signSession({ uid: user.id, email: user.email });

    const res = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } }, { status: 201 });
    res.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: "Signup failed", detail: e?.message }, { status: 500 });
  }
}