'use client'

type EndBowDividerProps = {
  className?: string
}

export default function EndBowDivider({ className = '' }: EndBowDividerProps) {
  const wrapperClassName = [
    'relative w-full max-w-none pointer-events-none select-none',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={wrapperClassName}>
      <div className="relative w-full overflow-visible">
        <div className="absolute -inset-x-12 -inset-y-8 z-0 blur-3xl opacity-45 bg-[radial-gradient(circle_at_center,rgba(214,174,189,0.7)_0%,rgba(214,174,189,0.28)_38%,transparent_72%)]" />
        <img
          src="/assets/dividers/end-bow.png"
          alt=""
          aria-hidden="true"
          role="presentation"
          className="relative z-10 block w-full h-auto drop-shadow-[0_28px_55px_rgba(0,0,0,0.18)]"
        />
      </div>
    </div>
  )
}
