import { NextRequest, NextResponse } from "next/server";
import { deleteDraft, getDraftById, updateDraft } from "@/lib/admin/blogStore";

type AdminBlogRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: NextRequest, context: AdminBlogRouteContext) {
  const { id } = await context.params;
  const draft = await getDraftById(id);
  if (!draft) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ draft });
}

export async function PATCH(req: NextRequest, context: AdminBlogRouteContext) {
  const { id } = await context.params;
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const next = await updateDraft(id, body);
  if (!next) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ draft: next });
}

export async function DELETE(_: NextRequest, context: AdminBlogRouteContext) {
  const { id } = await context.params;
  const ok = await deleteDraft(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
