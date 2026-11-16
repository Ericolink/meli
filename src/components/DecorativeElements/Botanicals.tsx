import type { CSSProperties } from 'react'

interface BotanicalProps {
  className?: string
  style?: CSSProperties
}

/**
 * Flor prensada de cinco pétalos con tallo y hojas.
 * Colores apagados con multiply para parecer pegada sobre el papel.
 */
export function PressedFlower({
  className = '',
  style,
  petal = '#A66F70',
}: BotanicalProps & { petal?: string }) {
  return (
    <svg
      viewBox="0 0 120 200"
      className={className}
      style={{ mixBlendMode: 'multiply', ...style }}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M60 72 C58 110 63 140 57 196"
        fill="none"
        stroke="#7d7a5c"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M59 128 C40 118 26 122 18 134 C34 140 48 138 59 128Z"
        fill="#949a7c"
        opacity=".8"
      />
      <path
        d="M60 150 C78 138 94 142 102 152 C88 160 72 160 60 150Z"
        fill="#8d9476"
        opacity=".75"
      />
      <path d="M59 128 L28 132 M60 150 L94 152" stroke="#6f7257" strokeWidth=".8" opacity=".6" />
      <g transform="translate(60 52)" opacity=".86">
        {[0, 72, 144, 216, 288].map((r) => (
          <path
            key={r}
            transform={`rotate(${r})`}
            d="M0 -4 C-14 -10 -16 -34 0 -40 C16 -34 14 -10 0 -4Z"
            fill={petal}
          />
        ))}
        {[0, 72, 144, 216, 288].map((r) => (
          <path
            key={`v${r}`}
            transform={`rotate(${r})`}
            d="M0 -6 L0 -30"
            stroke="#783E46"
            strokeWidth=".7"
            opacity=".45"
          />
        ))}
        <circle r="7" fill="#c9a36b" />
        <circle r="7" fill="none" stroke="#8a6a3c" strokeWidth="1" strokeDasharray="1.5 2" />
      </g>
    </svg>
  )
}

/** Ramita con hojas alternas (tipo eucalipto/olivo seco). */
export function BotanicalSprig({
  className = '',
  style,
  color = '#949a7c',
}: BotanicalProps & { color?: string }) {
  const leaves = [
    { y: 30, side: -1, s: 0.8 },
    { y: 52, side: 1, s: 0.9 },
    { y: 76, side: -1, s: 1 },
    { y: 100, side: 1, s: 1 },
    { y: 124, side: -1, s: 0.95 },
    { y: 148, side: 1, s: 0.85 },
  ]
  return (
    <svg
      viewBox="0 0 80 200"
      className={className}
      style={{ mixBlendMode: 'multiply', ...style }}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M40 12 C44 60 36 120 42 194"
        fill="none"
        stroke="#7d7a5c"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {leaves.map((l) => (
        <g key={l.y} transform={`translate(41 ${l.y}) scale(${l.side * l.s} ${l.s})`}>
          <path d="M0 0 C10 -16 26 -18 32 -12 C26 0 12 6 0 0Z" fill={color} opacity=".82" />
          <path d="M1 -1 L28 -12" stroke="#6f7257" strokeWidth=".7" opacity=".55" />
        </g>
      ))}
      <ellipse cx="40" cy="12" rx="5" ry="7" fill={color} opacity=".85" />
    </svg>
  )
}

/** Pequeñas flores silvestres (lavanda / gypsophila). */
export function WildflowerSprig({ className = '', style }: BotanicalProps) {
  const buds = [
    [40, 20],
    [34, 30],
    [46, 34],
    [38, 44],
    [47, 52],
    [35, 60],
    [44, 70],
  ]
  return (
    <svg
      viewBox="0 0 80 180"
      className={className}
      style={{ mixBlendMode: 'multiply', ...style }}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M41 30 C40 80 44 120 38 176"
        fill="none"
        stroke="#7d7a5c"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path d="M40 110 C28 100 18 102 14 108 C24 114 34 114 40 110Z" fill="#949a7c" opacity=".7" />
      {buds.map(([x, y], i) => (
        <ellipse
          key={i}
          cx={x}
          cy={y}
          rx="4.2"
          ry="6"
          fill={i % 2 ? '#a66f70' : '#b98a87'}
          opacity=".78"
          transform={`rotate(${i % 2 ? 18 : -18} ${x} ${y})`}
        />
      ))}
    </svg>
  )
}

/** Pequeño helecho seco. */
export function FernSprig({ className = '', style }: BotanicalProps) {
  const pinnae = Array.from({ length: 11 }, (_, i) => i)
  return (
    <svg
      viewBox="0 0 90 200"
      className={className}
      style={{ mixBlendMode: 'multiply', ...style }}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M45 8 C47 70 43 130 46 196"
        fill="none"
        stroke="#8a7a5a"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {pinnae.map((i) => {
        const y = 22 + i * 15
        const s = 0.45 + Math.sin((i / 10) * Math.PI) * 0.6
        return (
          <g key={i}>
            <path
              transform={`translate(45 ${y}) scale(${s})`}
              d="M0 0 C-12 -6 -28 -4 -34 2 C-24 8 -10 6 0 0Z"
              fill="#a39a73"
              opacity=".7"
            />
            <path
              transform={`translate(46 ${y + 6}) scale(${s})`}
              d="M0 0 C12 -6 28 -4 34 2 C24 8 10 6 0 0Z"
              fill="#9a936c"
              opacity=".7"
            />
          </g>
        )
      })}
    </svg>
  )
}
