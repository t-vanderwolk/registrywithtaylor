import { promises as fs } from 'fs';
import path from 'path';

export type BlogDraftStatus = 'draft' | 'published';

export type BlogDraft = {
  id: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  coverImageUrl?: string;
  content?: string;
  status?: BlogDraftStatus;
  createdAt?: number;
  updatedAt?: number;
};

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'blog-drafts.json');

function normalizeStatus(value: unknown): BlogDraftStatus {
  return value === 'published' ? 'published' : 'draft';
}

async function ensureFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(FILE_PATH);
  } catch {
    await fs.writeFile(FILE_PATH, JSON.stringify({ drafts: [] }, null, 2), 'utf8');
  }
}

async function readAll(): Promise<{ drafts: BlogDraft[] }> {
  await ensureFile();
  const raw = await fs.readFile(FILE_PATH, 'utf8');

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.drafts)) {
      return { drafts: [] };
    }

    return {
      drafts: (parsed.drafts as BlogDraft[]).map((draft) => ({
        ...draft,
        status: normalizeStatus(draft.status),
      })),
    };
  } catch {
    return { drafts: [] };
  }
}

async function writeAll(next: { drafts: BlogDraft[] }) {
  await ensureFile();
  const normalized = {
    drafts: next.drafts.map((draft) => ({
      ...draft,
      status: normalizeStatus(draft.status),
    })),
  };
  await fs.writeFile(FILE_PATH, JSON.stringify(normalized, null, 2), 'utf8');
}

function uid() {
  return Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 8);
}

export async function getDrafts(): Promise<BlogDraft[]> {
  const { drafts } = await readAll();
  return drafts;
}

export async function getDraftById(id: string): Promise<BlogDraft | null> {
  const { drafts } = await readAll();
  return drafts.find((draft) => draft.id === id) ?? null;
}

export async function createDraft(): Promise<BlogDraft> {
  const now = Date.now();
  const draft: BlogDraft = {
    id: uid(),
    title: '',
    slug: '',
    excerpt: '',
    coverImageUrl: '',
    content: '',
    status: 'draft',
    createdAt: now,
    updatedAt: now,
  };

  const { drafts } = await readAll();
  drafts.push(draft);
  await writeAll({ drafts });

  return draft;
}

export async function updateDraft(id: string, patch: Partial<BlogDraft>): Promise<BlogDraft | null> {
  const now = Date.now();
  const data = await readAll();
  const idx = data.drafts.findIndex((draft) => draft.id === id);

  if (idx === -1) {
    return null;
  }

  const current = data.drafts[idx];
  const next: BlogDraft = {
    ...current,
    ...sanitizePatch(patch),
    id: current.id,
    createdAt: current.createdAt ?? now,
    updatedAt: now,
    status: normalizeStatus(patch.status ?? current.status),
  };

  data.drafts[idx] = next;
  await writeAll(data);

  return next;
}

export async function deleteDraft(id: string): Promise<boolean> {
  const data = await readAll();
  const before = data.drafts.length;
  data.drafts = data.drafts.filter((draft) => draft.id !== id);

  if (data.drafts.length === before) {
    return false;
  }

  await writeAll(data);
  return true;
}

function sanitizePatch(patch: Partial<BlogDraft>): Partial<BlogDraft> {
  const out: Partial<BlogDraft> = {};

  if (typeof patch.title === 'string') out.title = patch.title;
  if (typeof patch.slug === 'string') out.slug = patch.slug;
  if (typeof patch.excerpt === 'string') out.excerpt = patch.excerpt;
  if (typeof patch.coverImageUrl === 'string') out.coverImageUrl = patch.coverImageUrl;
  if (typeof patch.content === 'string') out.content = patch.content;
  if (patch.status === 'draft' || patch.status === 'published') out.status = patch.status;

  return out;
}
