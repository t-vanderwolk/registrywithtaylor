import Image from 'next/image'
import MarketingSection from '@/components/layout/MarketingSection'
import { Eyebrow, SectionTitle, Lead, Body } from '@/components/Typography'

type Props = {
  eyebrow: string
  title: string
  description: string
  bullets?: string[]
  image: string
  alt?: string
  href?: string
  reverse?: boolean
  tone?: 'white' | 'ivory' | 'ivoryWarm' | 'neutral' | 'blush'
  priority?: boolean
}

export default function ServiceFeatureRow({
  eyebrow,
  title,
  description,
  bullets = [],
  image,
  alt,
  href,
  reverse = false,
  tone = 'ivoryWarm',
  priority = false,
}: Props) {
  return (
    <MarketingSection tone={tone} spacing="spacious" container="wide">
<div className="grid grid-cols-2 gap-12 items-center">
        {/* TEXT */}
        <div className={`${reverse ? 'md:order-2' : ''} space-y-8`}>
          <Eyebrow>{eyebrow}</Eyebrow>

          <SectionTitle className="leading-[1.2]">
            {title}
          </SectionTitle>

          <Lead className="max-w-[48ch] text-[var(--color-muted)]">
            {description}
          </Lead>

          {bullets.length > 0 && (
            <ul className="space-y-3 pt-2">
              {bullets.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-2 w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                  <Body className="!m-0 text-[var(--color-muted)]">
                    {item}
                  </Body>
                </li>
              ))}
            </ul>
          )}

          {href && (
            <div className="pt-6">
              <a
                href={href}
                className="inline-flex items-center gap-2 text-xs tracking-[0.18em] uppercase border border-[var(--color-border)] rounded-full px-6 py-3 hover:bg-[var(--color-paper)] transition"
              >
                Explore Service →
              </a>
            </div>
          )}
        </div>

        {/* IMAGE */}
        <div
          className={`
            ${reverse ? 'md:order-1' : ''}
            relative w-full
            h-[320px] md:h-[420px] lg:h-[460px]
            overflow-hidden
            rounded-[28px]
            shadow-[0_28px_60px_rgba(0,0,0,0.07)]
          `}
        >
          <Image
            src={image}
            alt={alt || title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 520px"
            priority={priority}
          />
        </div>

      </div>
    </MarketingSection>
  )
}