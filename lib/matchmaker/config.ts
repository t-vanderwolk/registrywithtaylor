/**
 * #BabylistItForward Matchmaker — frozen program configuration.
 *
 * Contract: docs/BABYLIST-IT-FORWARD-MATCHMAKER.md (v1.5).
 *
 * THREE public giving lanes:
 *   1. BABYLIST_PURCHASE      — shop the family's reviewed registry
 *   2. TMBC_CONSULT           — gift a consultation (giver earns one too)
 *   3. EXTERNAL_SERVICE_GIFT  — eligible partner support (Tot Squad at launch)
 * OTHER_APPROVED exists as an internal/admin escape hatch only.
 *
 * RULES THIS FILE ENFORCES (Part B, decisions 6a–6d):
 *  1. External partners are CONFIG, not schema. The database stores only the
 *     stable keys defined here (`tot-squad`, `motherfund`, `service_gift_card`);
 *     display names/labels live here and may change freely without a migration.
 *  2. The config describes each gift kind's WORKFLOW: enabled state, approved
 *     destination URL, allowed confirmation methods, and whether delivery must
 *     be relayed to the family privately by TMBC.
 *  3. No route may branch on a provider name. Behavior differences must be
 *     expressible through these fields; if they can't, this config grows a
 *     field — routes never grow an `if (provider === …)`.
 *  4. Gift value never ranks participation. There is no minimum-spend concept
 *     anywhere in config, schema, or copy.
 */

// ─── External service-gift providers (EXTERNAL_SERVICE_GIFT lane) ─────────────

/** How an external gift event is allowed to reach CONFIRMED. */
export type MatchmakerExternalConfirmationMethod =
  | 'RECIPIENT'            // recipient confirms from their dashboard
  | 'ADMIN_PROOF'          // Taylor/admin reviews submitted structured proof
  | 'FIRST_PARTY_WEBHOOK'; // a trusted integration confirms server-side

export type ExternalGiftKindConfig = {
  /** Human label — display only, never persisted. */
  label: string;
  /**
   * Hard gate for the public UI. A kind ships disabled until its operating
   * mechanics are verified (contract Part I #8). Disabled kinds may render as
   * "coming soon" internally but produce no public CTA and accept no reports.
   */
  enabled: boolean;
  /** The ONLY approved link-out destination. Null while unverified. Never user-supplied. */
  destinationUrl: string | null;
  confirmationMethods: readonly MatchmakerExternalConfirmationMethod[];
  /**
   * True when the purchased deliverable (e.g. a gift-card code) must be relayed
   * to the family privately by TMBC because the giver never receives the
   * family's contact information (contract decision 6b).
   */
  requiresRecipientRelay: boolean;
};

export type ExternalGiftProviderConfig = {
  /** Stable identifier key — THIS is what gets persisted on gift events. */
  key: string;
  /** Display name — never persisted. */
  displayName: string;
  giftKinds: Record<string, ExternalGiftKindConfig>;
};

export const EXTERNAL_GIFT_PROVIDERS = {
  'tot-squad': {
    key: 'tot-squad',
    displayName: 'Tot Squad',
    giftKinds: {
      motherfund: {
        label: 'MotherFund',
        enabled: false, // pending: directability to a named family (Part I #8c)
        destinationUrl: null, // pending: approved destination (Part I #8a)
        confirmationMethods: ['ADMIN_PROOF'],
        requiresRecipientRelay: false,
      },
      service_gift_card: {
        label: 'Service Gift Card',
        enabled: false, // pending: delivery mechanics (Part I #8b)
        destinationUrl: null, // pending: approved destination (Part I #8a)
        confirmationMethods: ['RECIPIENT', 'ADMIN_PROOF'],
        requiresRecipientRelay: true,
      },
    },
  },
} as const satisfies Record<string, ExternalGiftProviderConfig>;

export type ExternalGiftProviderKey = keyof typeof EXTERNAL_GIFT_PROVIDERS;

export function getExternalGiftProvider(providerKey: string): ExternalGiftProviderConfig | null {
  return (EXTERNAL_GIFT_PROVIDERS as Record<string, ExternalGiftProviderConfig>)[providerKey] ?? null;
}

export function getExternalGiftKind(
  providerKey: string,
  kindKey: string,
): ExternalGiftKindConfig | null {
  return getExternalGiftProvider(providerKey)?.giftKinds[kindKey] ?? null;
}

/**
 * The validation gate for persisting an EXTERNAL_SERVICE_GIFT event: the
 * (provider, kind) pair must exist here. Enabled-ness is checked separately so
 * an admin can still record a manually-arranged gift for a disabled kind.
 */
export function isKnownExternalGift(providerKey: string, kindKey: string): boolean {
  return getExternalGiftKind(providerKey, kindKey) !== null;
}

/** A (provider, kind) the PUBLIC giving UI may offer: enabled with an approved destination. */
export function isPubliclyOfferedExternalGift(providerKey: string, kindKey: string): boolean {
  const kind = getExternalGiftKind(providerKey, kindKey);
  return !!kind && kind.enabled && kind.destinationUrl !== null;
}

export type EnabledExternalGiftOption = {
  providerKey: string;
  providerDisplayName: string;
  kindKey: string;
  kindLabel: string;
  destinationUrl: string;
  confirmationMethods: readonly MatchmakerExternalConfirmationMethod[];
  requiresRecipientRelay: boolean;
};

/** Everything the public "ways to help" UI is allowed to render for the external lane. */
export function listEnabledExternalGiftOptions(): EnabledExternalGiftOption[] {
  const options: EnabledExternalGiftOption[] = [];
  for (const provider of Object.values(EXTERNAL_GIFT_PROVIDERS) as ExternalGiftProviderConfig[]) {
    for (const [kindKey, kind] of Object.entries(provider.giftKinds)) {
      if (!kind.enabled || kind.destinationUrl === null) continue;
      options.push({
        providerKey: provider.key,
        providerDisplayName: provider.displayName,
        kindKey,
        kindLabel: kind.label,
        destinationUrl: kind.destinationUrl,
        confirmationMethods: kind.confirmationMethods,
        requiresRecipientRelay: kind.requiresRecipientRelay,
      });
    }
  }
  return options;
}

// ─── Giver Consultation Benefit ───────────────────────────────────────────────
//
// A CONFIRMED TMBC_CONSULT gift earns the giver one complimentary TMBC
// consultation. It is a thank-you entitlement attached to that gift — NOT a
// fourth giving lane, and NOT itself a qualifying gift for chain eligibility
// (the original TMBC_CONSULT gift is what qualifies). Non-transferable in V1.

export type GiverConsultUseKey = 'OWN_REGISTRY' | 'GIFTER_CONCIERGE';

export type GiverConsultUseOption = {
  key: GiverConsultUseKey;
  label: string;
  description: string;
  /** Which Calendly event this use routes to. */
  calendlyEnvVar: string;
};

export const GIVER_CONSULT_USE_OPTIONS: readonly GiverConsultUseOption[] = [
  {
    key: 'OWN_REGISTRY',
    label: 'My own registry',
    description:
      'Use it for help with your own baby registry and planning.',
    calendlyEnvVar: 'NEXT_PUBLIC_CALENDLY_PREPAID_URL',
  },
  {
    key: 'GIFTER_CONCIERGE',
    label: 'Help me choose a gift',
    description:
      "Use it to understand this family's Babylist, what the products actually do, and where your gift would make the biggest difference.",
    calendlyEnvVar: 'NEXT_PUBLIC_CALENDLY_GIFTER_CONCIERGE_URL',
  },
] as const;

export function getGiverConsultUseOption(key: string): GiverConsultUseOption | null {
  return GIVER_CONSULT_USE_OPTIONS.find((o) => o.key === key) ?? null;
}

/** Frozen shopper-facing copy for the TMBC consultation lane (contract v1.5). */
export const TMBC_CONSULT_LANE_COPY = {
  title: 'Gift a TMBC Consultation',
  body:
    'Give this family a private consultation with Taylor — and I\u2019ll gift you one too. ' +
    'Use yours for your own registry, or let me help you navigate their Babylist and ' +
    'understand the products before you choose what to send.',
} as const;
