import { useId, type CSSProperties, type ReactNode } from 'react'

/** Contorno irregular de cera derretida (determinista). */
function waxOutline(cx: number, cy: number, r: number) {
  const n = 22
  const pts: string[] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    const wobble = Math.sin(i * 2.7) * 2.4 + Math.cos(i * 1.3) * 1.8 + (i % 3 === 0 ? 2.6 : 0)
    const rr = r + wobble
    pts.push(`${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`)
  }
  return `M${pts.join(' L')}Z`
}

const SEAL_PATH = waxOutline(50, 50, 44)

interface SealProps {
  className?: string
  style?: CSSProperties
  initial?: string
}

/** Sello de cera color vino con monograma. */
export function WaxSeal({ className = '', style, initial = 'M' }: SealProps) {
  const id = useId()
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-g`} cx="38%" cy="34%" r="70%">
          <stop offset="0" stopColor="#9a5560" />
          <stop offset=".55" stopColor="#783e46" />
          <stop offset="1" stopColor="#5a2b33" />
        </radialGradient>
      </defs>
      <path d={SEAL_PATH} fill={`url(#${id}-g)`} />
      <circle cx="50" cy="50" r="31" fill="none" stroke="#4d232a" strokeWidth="2.5" opacity=".55" />
      <circle cx="50" cy="50" r="31" fill="none" stroke="#b37a82" strokeWidth=".8" opacity=".5" transform="translate(-.8 -.8)" />
      {/* pequeña corona de hojas */}
      {Array.from({ length: 12 }, (_, i) => (
        <ellipse
          key={i}
          cx="50"
          cy="24.5"
          rx="1.6"
          ry="3.2"
          fill="#4d232a"
          opacity=".45"
          transform={`rotate(${i * 30} 50 50)`}
        />
      ))}
      <text
        x="50"
        y="61"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontStyle="italic"
        fontWeight="600"
        fontSize="32"
        fill="#4a2129"
        opacity=".8"
      >
        {initial}
      </text>
      <text
        x="49.3"
        y="60.2"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontStyle="italic"
        fontWeight="600"
        fontSize="32"
        fill="#b8838a"
        opacity=".35"
      >
        {initial}
      </text>
      <ellipse cx="36" cy="32" rx="10" ry="5" fill="#fff" opacity=".1" transform="rotate(-30 36 32)" />
    </svg>
  )
}

/** Sello postal con borde perforado. */
export function PostageStamp({
  className = '',
  style,
  children,
  label = '2026',
}: {
  className?: string
  style?: CSSProperties
  children?: ReactNode
  label?: string
}) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        filter: 'drop-shadow(0 2px 3px rgb(85 72 61 / .25))',
        ...style,
      }}
      aria-hidden="true"
    >
      <div
        className="flex h-full w-full flex-col items-center justify-between bg-crema p-[9%]"
        style={{
          WebkitMask:
            'radial-gradient(circle at center, transparent 0 2.6px, #000 3px) -4px -4px / 8px 8px round, linear-gradient(#000 0 0) center / calc(100% - 8px) calc(100% - 8px) no-repeat',
          mask: 'radial-gradient(circle at center, transparent 0 2.6px, #000 3px) -4px -4px / 8px 8px round, linear-gradient(#000 0 0) center / calc(100% - 8px) calc(100% - 8px) no-repeat',
        }}
      >
        <div className="flex w-full flex-1 items-center justify-center overflow-hidden border border-rosa/40 bg-[#efe3d2]">
          {children}
        </div>
        <span className="mt-[6%] font-display text-[0.7rem] font-semibold tracking-[0.2em] text-vino">
          {label}
        </span>
      </div>
    </div>
  )
}

/** Matasellos circular (marca de tinta). */
export function Postmark({ className = '', text = 'UN MUNDO POR DESCUBRIR' }: { className?: string; text?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true" style={{ mixBlendMode: 'multiply' }}>
      <defs>
        <path id={`${id}-c`} d="M60 60 m-40 0 a40 40 0 1 1 80 0 a40 40 0 1 1 -80 0" />
      </defs>
      <g fill="none" stroke="#783e46" opacity=".5">
        <circle cx="60" cy="60" r="50" strokeWidth="1.6" />
        <circle cx="60" cy="60" r="30" strokeWidth="1" />
      </g>
      <text fontFamily="'Cormorant Garamond', Georgia, serif" fontSize="10.5" fontWeight="600" letterSpacing="2.4" fill="#783e46" opacity=".55">
        <textPath href={`#${id}-c`}>{text}</textPath>
      </text>
      <text x="60" y="65" textAnchor="middle" fontFamily="'Cormorant Garamond', Georgia, serif" fontSize="15" fontWeight="600" fill="#783e46" opacity=".55">
        2026
      </text>
    </svg>
  )
}

/** Cinta adhesiva. */
export function Tape({
  className = '',
  style,
  variant = 'beige',
}: {
  className?: string
  style?: CSSProperties
  variant?: 'beige' | 'rosa'
}) {
  return (
    <span
      className={`tape ${variant === 'rosa' ? 'tape--rosa' : ''} ${className}`}
      style={style}
      aria-hidden="true"
    />
  )
}

/** Ornamento divisor con hoja central. */
export function Ornament({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 24" className={className} aria-hidden="true" focusable="false">
      <g fill="none" stroke="#a66f70" strokeLinecap="round">
        <path d="M8 12 C50 12 70 12 100 12" strokeWidth="1" opacity=".6" />
        <path d="M140 12 C170 12 190 12 232 12" strokeWidth="1" opacity=".6" />
        <path d="M104 12 C110 4 116 4 120 12 C124 4 130 4 136 12" strokeWidth="1.2" />
        <path d="M104 12 C110 20 116 20 120 12 C124 20 130 20 136 12" strokeWidth="1.2" />
      </g>
      <circle cx="120" cy="12" r="2.2" fill="#783e46" />
      <circle cx="94" cy="12" r="1.3" fill="#a66f70" />
      <circle cx="146" cy="12" r="1.3" fill="#a66f70" />
    </svg>
  )
}
