export type CtaButtonVariant = 'primary' | 'secondary' | 'text';

export type CtaButton = {
  id: string;
  label: string;
  url: string;
  variant: CtaButtonVariant;
  partnerId?: string | null;
};

const CTA_SLOT_PREFIX = '::cta-slot ';

type ParsedCtaButtons = {
  body: string;
  buttons: CtaButton[];
  malformed: boolean;
};

const CTA_STORAGE_PREFIX = '<!--TMBC_CTA_BUTTONS:';
const CTA_STORAGE_PATTERN = /<!--TMBC_CTA_BUTTONS:([\s\S]*?)-->/g;
const LEGACY_CTA_PREFIX = '::cta-button ';

function normalizeVariant(value: unknown): CtaButtonVariant {
  if (value === 'secondary' || value === 'text') {
    return value;
  }

  return 'primary';
}

function normalizeText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizePartnerId(value: unknown) {
  const partnerId = normalizeText(value);
  return partnerId.length > 0 ? partnerId : null;
}

function fallbackButtonId(index: number) {
  return `cta-${index + 1}`;
}

function sanitizeButton(value: unknown, index: number): CtaButton | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const candidate = value as Partial<CtaButton>;
  const label = normalizeText(candidate.label);
  const url = normalizeText(candidate.url);

  if (!label || !url) {
    return null;
  }

  return {
    id: normalizeText(candidate.id) || fallbackButtonId(index),
    label,
    url,
    variant: normalizeVariant(candidate.variant),
    partnerId: normalizePartnerId(candidate.partnerId),
  };
}

function dedupeButtons(buttons: CtaButton[]) {
  const seen = new Set<string>();
  const deduped: CtaButton[] = [];

  for (const button of buttons) {
    const key = [button.label, button.url, button.variant, button.partnerId ?? ''].join('::');
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    deduped.push(button);
  }

  return deduped;
}

function collapseSpacing(value: string) {
  return value.replace(/\n{3,}/g, '\n\n').trim();
}

function parseStoragePayload(raw: string) {
  try {
    const parsed = JSON.parse(raw) as { buttons?: unknown[] } | unknown[];
    const items = Array.isArray(parsed) ? parsed : Array.isArray(parsed.buttons) ? parsed.buttons : [];
    const buttons = items
      .map((item, index) => sanitizeButton(item, index))
      .filter((item): item is CtaButton => item !== null);

    return { buttons, malformed: false };
  } catch {
    return { buttons: [] as CtaButton[], malformed: true };
  }
}

function parseLegacyButtons(content: string) {
  const buttons: CtaButton[] = [];
  const keptLines: string[] = [];
  let malformed = false;

  content.split('\n').forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed.startsWith(LEGACY_CTA_PREFIX)) {
      keptLines.push(line);
      return;
    }

    const payload = trimmed.slice(LEGACY_CTA_PREFIX.length).trim();
    if (!payload) {
      malformed = true;
      return;
    }

    try {
      const parsed = JSON.parse(payload) as unknown;
      const button = sanitizeButton(parsed, index);
      if (!button) {
        malformed = true;
        return;
      }

      buttons.push(button);
    } catch {
      malformed = true;
    }
  });

  return {
    body: collapseSpacing(keptLines.join('\n')),
    buttons,
    malformed,
  };
}

function stripStorageBlock(content: string) {
  return collapseSpacing(content.replace(CTA_STORAGE_PATTERN, ''));
}

export function isValidCtaUrl(value: string) {
  return /^https?:\/\//i.test(value.trim());
}

export function createEmptyCtaButton(index = 0): CtaButton {
  return {
    id: fallbackButtonId(index),
    label: '',
    url: '',
    variant: 'primary',
    partnerId: null,
  };
}

export function createCtaSlotToken(buttonId: string) {
  return `\n\n${CTA_SLOT_PREFIX}${buttonId}\n\n`;
}

export function parseCtaSlotLine(line: string) {
  const trimmed = line.trim();
  if (!trimmed.startsWith(CTA_SLOT_PREFIX)) {
    return null;
  }

  const buttonId = normalizeText(trimmed.slice(CTA_SLOT_PREFIX.length));
  return buttonId || null;
}

export function extractStoredCtaButtons(content: string): ParsedCtaButtons {
  const matches = [...content.matchAll(CTA_STORAGE_PATTERN)];
  if (matches.length === 0) {
    return {
      body: collapseSpacing(content),
      buttons: [],
      malformed: false,
    };
  }

  const latestMatch = matches[matches.length - 1];
  const rawPayload = latestMatch?.[1] ?? '';
  const parsed = parseStoragePayload(rawPayload);

  return {
    body: stripStorageBlock(content),
    buttons: dedupeButtons(parsed.buttons),
    malformed: parsed.malformed || matches.length > 1,
  };
}

export function extractEditorCtaButtons(content: string): ParsedCtaButtons {
  const stored = extractStoredCtaButtons(content);
  const legacy = parseLegacyButtons(stored.body);

  return {
    body: legacy.body,
    buttons: dedupeButtons([...stored.buttons, ...legacy.buttons]),
    malformed: stored.malformed || legacy.malformed,
  };
}

export function serializeCtaButtons(body: string, buttons: CtaButton[]) {
  const cleanBody = parseLegacyButtons(stripStorageBlock(body)).body;
  const cleanButtons = buttons
    .map((button, index) => sanitizeButton(button, index))
    .filter((button): button is CtaButton => button !== null);

  if (cleanButtons.length === 0) {
    return cleanBody;
  }

  const payload = JSON.stringify({
    buttons: cleanButtons.map((button) => ({
      id: button.id,
      label: button.label,
      url: button.url,
      variant: button.variant,
      partnerId: button.partnerId ?? null,
    })),
  });

  if (!cleanBody) {
    return `${CTA_STORAGE_PREFIX}${payload}-->`;
  }

  return `${cleanBody}\n\n${CTA_STORAGE_PREFIX}${payload}-->`;
}

export function validateCtaButtons(buttons: CtaButton[]) {
  for (const button of buttons) {
    if (!button.label.trim()) {
      return 'CTA buttons must include a label.';
    }

    if (!isValidCtaUrl(button.url)) {
      return 'CTA buttons must include a valid http:// or https:// URL.';
    }
  }

  return null;
}
