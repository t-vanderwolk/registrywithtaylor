'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';

type WorkbookPrompt = {
  id: string;
  label: string;
  placeholder: string;
};

type MiniWorkbookProps = {
  prompts: WorkbookPrompt[];
  subtitle?: string;
  /** Academy path slug — used to namespace saved responses. */
  pathSlug?: string;
  /** Academy module slug — used to namespace saved responses. */
  moduleSlug?: string;
};

// ─── Guest token helpers ──────────────────────────────────────────────────────

function getOrCreateGuestToken(): string | null {
  try {
    const key = 'tmbc_guest_token';
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    const token = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem(key, token);
    return token;
  } catch {
    return null;
  }
}

// ─── API helpers ──────────────────────────────────────────────────────────────

/** Save a single prompt response for unauthenticated (guest) users. */
async function saveGuestResponse({
  pathSlug,
  moduleSlug,
  promptId,
  response,
  guestToken,
}: {
  pathSlug: string;
  moduleSlug: string;
  promptId: string;
  response: string;
  guestToken: string | null;
}) {
  if (!guestToken) return;
  await fetch('/api/learn/workbook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pathSlug, moduleSlug, promptId, response, guestToken }),
  });
}

async function fetchGuestResponses({
  pathSlug,
  moduleSlug,
  guestToken,
}: {
  pathSlug: string;
  moduleSlug: string;
  guestToken: string | null;
}): Promise<Record<string, string>> {
  if (!guestToken) return {};
  try {
    const res = await fetch(
      `/api/learn/workbook?pathSlug=${pathSlug}&moduleSlug=${moduleSlug}&guestToken=${guestToken}`,
    );
    const data = await res.json();
    return data.responses ?? {};
  } catch {
    return {};
  }
}

/** Save all prompt answers as one ModuleNote for authenticated users. */
async function saveModuleNote({
  pathSlug,
  moduleSlug,
  content,
}: {
  pathSlug: string;
  moduleSlug: string;
  content: string;
}) {
  await fetch('/api/workbook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pathSlug, moduleSlug, content }),
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MiniWorkbook({
  prompts,
  subtitle = 'Take a few minutes to reflect before moving on.',
  pathSlug,
  moduleSlug,
}: MiniWorkbookProps) {
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';

  const [answers, setAnswers] = useState<Record<string, string>>(
    Object.fromEntries(prompts.map((p) => [p.id, ''])),
  );
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const guestTokenRef = useRef<string | null>(null);

  // For guests only: init token + load prior responses
  useEffect(() => {
    if (isAuthenticated || !pathSlug || !moduleSlug) return;

    guestTokenRef.current = getOrCreateGuestToken();
    if (!guestTokenRef.current) return;

    fetchGuestResponses({
      pathSlug,
      moduleSlug,
      guestToken: guestTokenRef.current,
    }).then((savedResponses) => {
      if (Object.keys(savedResponses).length > 0) {
        setAnswers((prev) => ({ ...prev, ...savedResponses }));
      }
    });
  }, [pathSlug, moduleSlug, isAuthenticated]);

  const handleSave = useCallback(async () => {
    if (!pathSlug || !moduleSlug) return;

    const hasContent = prompts.some((p) => (answers[p.id] ?? '').trim().length > 0);
    if (!hasContent) return;

    setSaving(true);

    if (isAuthenticated) {
      // Combine all answers into a single formatted string for the dashboard workbook
      const content = prompts
        .map((p) => {
          const answer = (answers[p.id] ?? '').trim();
          if (!answer) return null;
          return `${p.label}\n${answer}`;
        })
        .filter(Boolean)
        .join('\n\n');

      await saveModuleNote({ pathSlug, moduleSlug, content });
    } else {
      // Guest: save each prompt individually via guestToken
      const token = guestTokenRef.current;
      await Promise.all(
        prompts.map((prompt) =>
          saveGuestResponse({
            pathSlug,
            moduleSlug,
            promptId: prompt.id,
            response: answers[prompt.id] ?? '',
            guestToken: token,
          }),
        ),
      );
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  }, [pathSlug, moduleSlug, prompts, answers, isAuthenticated]);

  return (
    <div className="overflow-hidden rounded-[1.45rem] border border-[rgba(215,161,175,0.22)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(253,247,244,0.96)_100%)] shadow-[0_12px_34px_rgba(72,49,56,0.06)]">
      {/* Header */}
      <div className="border-b border-[rgba(0,0,0,0.06)] bg-[rgba(232,154,174,0.06)] px-6 py-5 sm:px-8">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[var(--color-accent-dark)]">
          Mini Workbook
        </p>
        <p className="mt-2 font-serif text-[1.25rem] leading-tight tracking-[-0.02em] text-neutral-900 sm:text-[1.45rem]">
          {subtitle}
        </p>
      </div>

      {/* Prompts */}
      <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-7">
        {prompts.map((prompt, index) => (
          <div key={prompt.id} className="space-y-2.5">
            <label
              htmlFor={`workbook-${prompt.id}`}
              className="block text-[0.88rem] font-medium text-neutral-800"
            >
              <span className="mr-2 font-handwritten-print text-[1.05rem] text-[var(--color-accent-dark)]">
                {index + 1}.
              </span>
              {prompt.label}
            </label>
            <textarea
              id={`workbook-${prompt.id}`}
              rows={3}
              value={answers[prompt.id] ?? ''}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, [prompt.id]: e.target.value }))
              }
              placeholder={prompt.placeholder}
              className="w-full resize-none rounded-[0.9rem] border border-[rgba(47,36,48,0.1)] bg-white px-4 py-3.5 text-[0.96rem] leading-[1.7] text-neutral-800 placeholder-neutral-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition-all duration-200 focus:border-[rgba(216,137,160,0.4)] focus:outline-none focus:ring-2 focus:ring-[rgba(216,137,160,0.2)]"
            />
          </div>
        ))}

        <div className="flex flex-col items-start gap-3 border-t border-[rgba(0,0,0,0.06)] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.82rem] leading-6 text-neutral-400">
            {isAuthenticated
              ? 'Your reflections are saved to your dashboard workbook.'
              : 'Your reflections stay private and help guide your session.'}
          </p>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={[
              'inline-flex min-h-[44px] items-center rounded-full px-6 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70',
              saved
                ? 'bg-[rgba(232,154,174,0.14)] text-[var(--color-accent-dark)]'
                : 'bg-[var(--color-accent-dark)] text-white shadow-[0_8px_20px_rgba(212,123,145,0.28)] hover:bg-[#c76b82]',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {saved
              ? isAuthenticated
                ? 'Saved to Dashboard ✓'
                : 'Saved ✓'
              : saving
              ? 'Saving…'
              : 'Save Reflection'}
          </button>
        </div>
      </div>
    </div>
  );
}
