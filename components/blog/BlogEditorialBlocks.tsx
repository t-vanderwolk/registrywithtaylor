import type { ReactNode } from 'react';

/**
 * Editorial styled blocks for the blog custom-Markdown system.
 *
 * These are purely presentational: PostContent parses the `:::block` fences
 * (see lib/blog/styledBlocks.ts) and pre-renders every inline field through
 * renderInlineContent (bold / italics / links / brand annotations) before
 * handing the ReactNodes down here. They share the `.content-widget` frame and
 * the `--tmbc-blog-*` / --color-* design tokens with the existing widgets, and
 * every block fails gracefully when its optional fields are missing.
 */

/** :::quick-answer — prominent editorial summary box answering the core question. */
export function QuickAnswer({ children }: { children: ReactNode }) {
  return (
    <aside className="content-widget blog-quick-answer" aria-label="Quick answer">
      <p className="blog-quick-answer__label">Quick Answer</p>
      <div className="blog-quick-answer__body tmbc-widget-copy">{children}</div>
    </aside>
  );
}

/** :::note — small, understated info note, quieter than a callout. */
export function Note({ children }: { children: ReactNode }) {
  return (
    <aside className="content-widget blog-note" role="note">
      <span className="blog-note__marker" aria-hidden="true" />
      <div className="blog-note__body">{children}</div>
    </aside>
  );
}

/** :::feature-list — two-column feature grid, each with a subtle marker. */
export function FeatureList({
  title,
  features,
}: {
  title?: ReactNode;
  features: ReactNode[];
}) {
  if (!features.length) return null;
  return (
    <section className="content-widget blog-feature-list">
      {title ? <p className="blog-feature-list__title tmbc-widget-title">{title}</p> : null}
      <ul className="blog-feature-list__grid" role="list">
        {features.map((feature, index) => (
          <li key={`feature-${index}`} className="blog-feature-list__item">
            <span className="blog-feature-list__check" aria-hidden="true">
              <svg viewBox="0 0 16 16" width="14" height="14" focusable="false">
                <path
                  d="M13.5 4.5 6.75 11.25 3 7.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="blog-feature-list__text">{feature}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** :::decision-cards — a row of editorial option cards (heading + explanation). */
export function DecisionCards({
  title,
  cards,
}: {
  title?: ReactNode;
  cards: Array<{ heading: ReactNode; body: ReactNode | null }>;
}) {
  if (!cards.length) return null;
  return (
    <section className="content-widget blog-decision-cards">
      {title ? <p className="blog-decision-cards__title tmbc-widget-title">{title}</p> : null}
      <div className="blog-decision-cards__grid">
        {cards.map((card, index) => (
          <article key={`decision-card-${index}`} className="blog-decision-cards__card">
            <h4 className="blog-decision-cards__heading">{card.heading}</h4>
            {card.body ? <p className="blog-decision-cards__body">{card.body}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}

/** :::checklist — print-friendly checklist with empty (non-interactive) checkboxes. */
export function Checklist({
  title,
  items,
}: {
  title?: ReactNode;
  items: ReactNode[];
}) {
  if (!items.length) return null;
  return (
    <section className="content-widget blog-checklist">
      {title ? <p className="blog-checklist__title tmbc-widget-title">{title}</p> : null}
      <ul className="blog-checklist__list" role="list">
        {items.map((item, index) => (
          <li key={`checklist-${index}`} className="blog-checklist__item">
            <span className="blog-checklist__box" aria-hidden="true" />
            <span className="blog-checklist__text">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** :::verdict — strong closing summary: category label → recommendation. */
export function Verdict({
  rows,
}: {
  rows: Array<{ label: ReactNode; value: ReactNode }>;
}) {
  if (!rows.length) return null;
  return (
    <section className="content-widget blog-verdict" aria-label="Verdict">
      <p className="blog-verdict__eyebrow">The verdict</p>
      <dl className="blog-verdict__rows">
        {rows.map((row, index) => (
          <div key={`verdict-${index}`} className="blog-verdict__row">
            <dt className="blog-verdict__label">{row.label}</dt>
            <dd className="blog-verdict__value">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
