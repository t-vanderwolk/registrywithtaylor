import Image from 'next/image'

export function RibbonDivider() {
  return (
    <div className="relative w-full py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-6">
        <Image
          src="/assets/brand/dividers/ribbon-wave.png"
          alt=""
          width={1600}
          height={200}
          className="w-full h-auto object-contain scale-[0.98] brightness-95"
          priority
        />
      </div>
    </div>
  )
}
