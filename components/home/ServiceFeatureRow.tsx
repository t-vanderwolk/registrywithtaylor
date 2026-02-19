import Image from 'next/image'
import Link from 'next/link'
import MarketingSection from '@/components/layout/MarketingSection'
import { Eyebrow, SectionTitle, Lead, Body } from '@/components/Typography'

type Props = {
  eyebrow: string
  title: string
  description: string
  bullets?: string[]
  sectionHeader?: string
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
  sectionHeader,
  image,
  alt,
  href,
  reverse = false,
  tone = 'ivoryWarm',
  priority = false,
}: Props) {
  return (
    <MarketingSection
      tone={tone}
      spacing="spacious"
      container="wide"
      className={sectionHeader ? '!pt-8 md:!pt-12' : ''}
    >
      {sectionHeader && (
        <div className="mb-6 w-full text-left">
          <p className="!mb-0 text-xs tracking-[0.3em] uppercase text-[var(--color-muted)]">
            {sectionHeader}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-12 items-center">
        {/* TEXT */}
        <div className={`${reverse ? 'order-2 ml-auto' : 'mr-auto'} w-full max-w-[48ch] space-y-8`}>
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
              <Link
                href={href}
                className="btn btn--primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                Explore Service →
              </Link>
            </div>
          )}
        </div>

        {/* IMAGE */}
        <div
          className={`
            ${reverse ? 'order-1 mr-auto' : 'ml-auto'}
            relative w-full max-w-[420px] aspect-square
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
            sizes="(max-width: 1024px) 100vw, 420px"
            priority={priority}
          />
        </div>

      </div>
    </MarketingSection>
  )
}
