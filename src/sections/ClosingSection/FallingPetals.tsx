import { useInView } from 'motion/react'
import { useRef, type CSSProperties } from 'react'

const PETALS = [
  { left: 6, size: 14, duration: 15, delay: -2, drift: 40, color: '#a66f70' },
  { left: 16, size: 10, duration: 18, delay: -9, drift: -30, color: '#d9c5b5' },
  { left: 27, size: 12, duration: 14, delay: -5, drift: 26, color: '#b98a87' },
  { left: 38, size: 9, duration: 19, delay: -13, drift: -22, color: '#949a7c' },
  { left: 49, size: 13, duration: 16, delay: -1, drift: 34, color: '#a66f70' },
  { left: 61, size: 10, duration: 17, delay: -11, drift: -36, color: '#d9c5b5' },
  { left: 72, size: 12, duration: 15, delay: -7, drift: 24, color: '#b98a87' },
  { left: 83, size: 9, duration: 20, delay: -15, drift: -26, color: '#a66f70' },
  { left: 93, size: 11, duration: 16, delay: -4, drift: -40, color: '#949a7c' },
]

/** Lluvia muy sutil de pétalos (se pausa fuera de pantalla y con movimiento reducido). */
export function FallingPetals() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${inView ? '' : 'is-paused'}`}
      aria-hidden="true"
    >
      {PETALS.map((p, i) => (
        <svg
          key={i}
          viewBox="0 0 20 24"
          className="petal"
          width={p.size}
          height={p.size * 1.2}
          style={
            {
              left: `${p.left}%`,
              '--petal-duration': `${p.duration}s`,
              '--petal-delay': `${p.delay}s`,
              '--petal-drift': `${p.drift}px`,
              '--petal-opacity': 0.65,
            } as CSSProperties
          }
        >
          <path d="M10 1 C17 6 19 14 10 23 C1 14 3 6 10 1Z" fill={p.color} />
          <path d="M10 4 L10 19" stroke="#783e46" strokeWidth=".6" opacity=".3" />
        </svg>
      ))}
    </div>
  )
}
