import { useRef, useState } from 'react'
import { Ornament, PressedFlower, Tape, WaxSeal, WildflowerSprig } from '../../components/DecorativeElements'
import { PhotoModal } from '../../components/PhotoModal/PhotoModal'
import { memoryRatio, type Memory } from '../../types/memories'
import { StickerSlot } from '../../components/DecorativeSticker/StickerSlot'

function Mortarboard({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={className} aria-hidden="true" focusable="false">
      <path d="M34 36 L34 52 C46 60 74 60 86 52 L86 36" fill="#6a3a41" />
      <path d="M34 52 C46 60 74 60 86 52" fill="none" stroke="#4d232a" strokeWidth="1" />
      <path d="M60 14 L112 32 L60 50 L8 32 Z" fill="#783e46" />
      <path d="M60 14 L112 32 L60 50 L8 32 Z" fill="none" stroke="#4d232a" strokeWidth="1" opacity=".7" />
      <path d="M60 18 L104 32" stroke="#a66f70" strokeWidth=".8" opacity=".6" />
      <circle cx="60" cy="32" r="2.6" fill="#c9a36b" />
      <path d="M60 32 C74 36 90 40 96 44 L96 62" fill="none" stroke="#c9a36b" strokeWidth="1.6" />
      <path d="M93 62 L99 62 L100 72 L92 72 Z" fill="#c9a36b" />
      <path d="M93.5 72 L93 76 M96 72 L96 77 M98.5 72 L99 76" stroke="#b08a50" strokeWidth=".9" />
    </svg>
  )
}

function Laurel({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  const leaves = Array.from({ length: 8 }, (_, i) => i)
  return (
    <svg
      viewBox="0 0 60 140"
      className={className}
      style={{ transform: flip ? 'scaleX(-1)' : undefined, mixBlendMode: 'multiply' }}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M50 136 C14 112 8 60 30 6" fill="none" stroke="#7d7a5c" strokeWidth="1.3" />
      {leaves.map((i) => {
        const t = i / 7
        const x = 50 - Math.sin(t * 2.4) * 34 - t * 6
        const y = 128 - t * 118
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${-20 - t * 30})`}>
            <path d="M0 0 C-12 -4 -16 -14 -12 -20 C-4 -16 2 -8 0 0Z" fill="#949a7c" opacity=".85" />
            <path d="M0 0 C10 -6 18 -4 20 2 C12 6 4 4 0 0Z" fill="#8d9476" opacity=".75" />
          </g>
        )
      })}
    </svg>
  )
}

interface DiplomaProps {
  name: string
  degree: string
  photo?: { src: string; alt: string; width?: number; height?: number }
}

/**
 * Composición del capítulo «El logro»: la fotografía de graduación (si existe)
 * sujeta con cinta y, encima, un diploma ilustrado sin datos institucionales.
 */
export function Diploma({ name, degree, photo }: DiplomaProps) {
  const [photoOk, setPhotoOk] = useState<boolean | null>(null)
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const showPhoto = !!photo && photoOk !== false
  const memory: Memory | null = photo
    ? { id: 'graduacion', src: photo.src, alt: photo.alt, category: 'melissa', order: 0, width: photo.width, height: photo.height }
    : null

  return (
    <figure className="relative mx-auto w-full max-w-[27rem] px-2 pt-4">
      {/* Fotografía de graduación: si el archivo no existe, no aparece */}
      {showPhoto && memory && (
        <div
          className="relative z-0 ml-1 w-[72%] transition-opacity duration-700 sm:w-[70%]"
          style={{ opacity: photoOk ? 1 : 0 }}
        >
          <button
            ref={triggerRef}
            type="button"
            className="polaroid block w-full -rotate-[4deg] text-left transition-transform duration-500 hover:-rotate-[2deg] focus-visible:-rotate-[2deg]"
            onClick={() => setOpen(true)}
            disabled={!photoOk}
            aria-label={`Ampliar fotografía: ${photo!.alt}`}
            aria-haspopup="dialog"
          >
            <Tape className="-top-3 left-1/2 -translate-x-1/2 rotate-[-3deg]" variant="rosa" />
            <div className="polaroid-photo" style={{ aspectRatio: memoryRatio(memory) }}>
              <img
                src={photo!.src}
                alt={photo!.alt}
                width={photo!.width ?? 800}
                height={photo!.height ?? 800}
                loading="lazy"
                decoding="async"
                onLoad={() => setPhotoOk(true)}
                onError={() => setPhotoOk(false)}
              />
            </div>
          </button>
        </div>
      )}

      <div
        className={`paper-aged relative z-[1] -rotate-[1.4deg] px-6 pb-14 pt-8 text-center sm:px-10 ${
          showPhoto ? 'ml-auto -mt-16 w-[86%] sm:-mt-20' : 'w-full'
        }`}
      >
        {/* doble filete */}
        <div className="pointer-events-none absolute inset-3 rounded-[2px] border border-rosa/45" />
        <div className="pointer-events-none absolute inset-[1.15rem] rounded-[2px] border border-rosa/25" />

        <Mortarboard className="mx-auto w-16 sm:w-20" />

        <div className="relative mt-3 flex items-center justify-center gap-1">
          <Laurel className="h-20 w-8 shrink-0 opacity-90 sm:h-24 sm:w-10" />
          <p className="font-display text-[clamp(2.2rem,9vw,3rem)] font-medium italic leading-none text-vino">
            {name}
          </p>
          <Laurel className="h-20 w-8 shrink-0 opacity-90 sm:h-24 sm:w-10" flip />
        </div>

        <Ornament className="mx-auto mt-3 w-28" />
        <p className="mt-2 font-display text-[1.05rem] font-semibold uppercase leading-snug tracking-[0.16em] text-cafe sm:text-lg">
          {degree}
        </p>

        {/* sello y cintas */}
        <div className="absolute -bottom-7 left-1/2 w-[4.5rem] -translate-x-1/2">
          <svg viewBox="0 0 80 60" className="absolute left-1/2 top-[55%] w-14 -translate-x-1/2" aria-hidden="true">
            <path d="M30 0 L18 58 L28 50 L34 60 L40 4 Z" fill="#783e46" opacity=".9" />
            <path d="M50 0 L62 58 L52 50 L46 60 L40 4 Z" fill="#6a3540" opacity=".9" />
          </svg>
          <WaxSeal className="relative w-full drop-shadow-[0_2px_3px_rgb(60_30_30/0.35)]" />
        </div>
      </div>

      <PressedFlower className="pointer-events-none absolute -bottom-8 -left-3 z-[2] w-14 rotate-[-32deg] sm:-left-8 sm:w-[4.5rem]" />
      <WildflowerSprig className="pointer-events-none absolute -right-1 top-2 w-10 rotate-[20deg] opacity-90" />

      <StickerSlot section="logro" slot="diploma" />
      <figcaption className="sr-only">
        Diploma ilustrado: {name}, {degree}
      </figcaption>

      {memory && (
        <PhotoModal
          items={open ? [memory] : []}
          activeId={open ? memory.id : null}
          onClose={() => {
            setOpen(false)
            window.setTimeout(() => triggerRef.current?.focus({ preventScroll: true }), 0)
          }}
          onChange={() => {}}
        />
      )}
    </figure>
  )
}
