import { NextResponse } from "next/server";
import { createDraft, getDrafts } from "@/lib/admin/blogStore";

export async function GET() {
  const drafts = await getDrafts();
  return NextResponse.json({ drafts });
}

export async function POST() {
  const draft = await createDraft();
  return NextResponse.json({ draft }, { status: 201 });
}
