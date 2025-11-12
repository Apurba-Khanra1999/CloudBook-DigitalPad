import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { sql, initNotesSchema, ensureUserByEmail } from "@/lib/db";
import { stackServerApp } from "@/stack/server";

async function getCurrentUserId(): Promise<number | null> {
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
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const payload = token ? verifySession(token) : null;
  return payload?.uid ?? null;
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await initNotesSchema();
    const uid = await getCurrentUserId();
    if (!uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const id = params.id;
    const body = await req.json();
    const title: string = (body?.title || '').trim();
    const content: string = body?.content || '';
    const folderId: string = (body?.folderId || 'notes').trim();
    const tags: string[] = Array.isArray(body?.tags) ? body.tags : [];
    const pinned: boolean | null = typeof body?.pinned === 'boolean' ? body.pinned : null;
    const rows = await sql`
      UPDATE notes
      SET title = ${title}, content = ${content}, folder_id = ${folderId}, tags = ${tags}, pinned = COALESCE(${pinned}, pinned), updated_at = NOW()
      WHERE id = ${id} AND user_id = ${uid}
      RETURNING *
    `;
    const updated = rows[0];
    if (!updated) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }
    return NextResponse.json({ note: {
      id: String(updated.id),
      title: String(updated.title ?? ''),
      content: String(updated.content ?? ''),
      folderId: String(updated.folder_id ?? 'notes'),
      tags: Array.isArray(updated.tags) ? updated.tags : [],
      pinned: Boolean(updated.pinned ?? false),
      createdAt: new Date(updated.created_at).toISOString(),
      updatedAt: new Date(updated.updated_at).toISOString(),
    } });
  } catch (e: any) {
    return NextResponse.json({ error: "Failed to update note", detail: e?.message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await initNotesSchema();
    const uid = await getCurrentUserId();
    if (!uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const id = params.id;
    const rows = await sql`
      DELETE FROM notes WHERE id = ${id} AND user_id = ${uid} RETURNING id
    `;
    const deleted = rows[0];
    if (!deleted) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: "Failed to delete note", detail: e?.message }, { status: 500 });
  }
}