import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { sql, initNotesSchema, ensureUserByEmail } from "@/lib/db";
import { stackServerApp } from "@/stack/server";
import { randomUUID } from "crypto";

function toNoteRow(row: any) {
  return {
    id: String(row.id),
    title: String(row.title ?? ''),
    content: String(row.content ?? ''),
    folderId: String(row.folder_id ?? 'notes'),
    tags: Array.isArray(row.tags) ? row.tags : [],
    pinned: Boolean(row.pinned ?? false),
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

async function getCurrentUserId(): Promise<number | null> {
  // Prefer Stack (Neon Auth)
  const stackUser = await stackServerApp.getUser({ or: "return-null" });
  if (stackUser) {
    const userJson = stackUser.toClientJson();
    const email = userJson.primary_email || "";
    const name = userJson.display_name || "";
    if (email) {
      const dbUser = await ensureUserByEmail(name, email);
      return dbUser.id;
    }
  }
  // Fallback to JWT cookie session
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const payload = token ? verifySession(token) : null;
  return payload?.uid ?? null;
}

export async function GET() {
  try {
    await initNotesSchema();
    const uid = await getCurrentUserId();
    if (!uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const rows = await sql`SELECT * FROM notes WHERE user_id = ${uid} ORDER BY pinned DESC, updated_at DESC`;
    const notes = rows.map(toNoteRow);
    return NextResponse.json({ notes }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: "Failed to fetch notes", detail: e?.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await initNotesSchema();
    const uid = await getCurrentUserId();
    if (!uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const title: string = (body?.title || '').trim();
    const content: string = body?.content || '';
    const folderId: string = (body?.folderId || 'notes').trim();
    const tags: string[] = Array.isArray(body?.tags) ? body.tags : [];
    const pinned: boolean = typeof body?.pinned === 'boolean' ? body.pinned : false;
    const id = randomUUID();
    const rows = await sql`
      INSERT INTO notes (id, user_id, title, content, folder_id, tags, pinned)
      VALUES (${id}, ${uid}, ${title}, ${content}, ${folderId}, ${tags}, ${pinned})
      RETURNING *
    `;
    const note = toNoteRow(rows[0]);
    return NextResponse.json({ note }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: "Failed to create note", detail: e?.message }, { status: 500 });
  }
}