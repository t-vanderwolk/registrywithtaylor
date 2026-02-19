'use client'

type EndBowDividerProps = {
  className?: string
}

export default function EndBowDivider({ className = '' }: EndBowDividerProps) {
  const wrapperClassName = [
    'relative w-screen max-w-none flex justify-center pointer-events-none',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={wrapperClassName}>
      <div className="relative w-full overflow-visible">
        <div className="absolute -inset-x-12 -inset-y-8 z-0 blur-3xl opacity-30 bg-[radial-gradient(circle_at_center,rgba(214,174,189,0.55)_0%,rgba(214,174,189,0.2)_38%,transparent_72%)]" />
        <img
          src="/assets/dividers/end-bow.png"
          alt=""
          className="relative z-10 block w-full h-auto drop-shadow-[0_18px_34px_rgba(0,0,0,0.12)]"
        />
      </div>
    </div>
  )
}
