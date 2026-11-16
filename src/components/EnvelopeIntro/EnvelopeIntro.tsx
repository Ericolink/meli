import { motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { BotanicalSprig, WaxSeal, WildflowerSprig } from '../DecorativeElements'

export type EnvelopeState = 'closed' | 'opening' | 'open'

interface EnvelopeIntroProps {
  state: EnvelopeState
  cardTitle: string
  cardNote: string
  /** Toque directo sobre el sobre (atajo decorativo; el botón es el control accesible). */
  onRequestOpen: () => void
  /** Se llama cuando la carta terminó de salir del sobre. */
  onOpened: () => void
}

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Sobre vintage con sello de cera. Secuencia de apertura:
 * sello se levanta → solapa gira → carta asciende.
 */
export function EnvelopeIntro({
  state,
  cardTitle,
  cardNote,
  onRequestOpen,
  onOpened,
}: EnvelopeIntroProps) {
  const reduce = useReducedMotion()
  const [flapOpen, setFlapOpen] = useState(false)
  const isOpening = state !== 'closed'

  return (
    <div
      className="relative mx-auto w-[min(78vw,340px)]"
      aria-hidden="true"
    >
      {/* Espacio reservado para la solapa abierta y la carta (proporcional al sobre) */}
      <div className="aspect-[100/36]" />
      {/* Flores secas asomando detrás del sobre */}
      <BotanicalSprig className="absolute -left-[9%] bottom-[-6%] z-0 w-[22%] -rotate-[28deg] opacity-90" />
      <WildflowerSprig className="absolute -right-[7%] bottom-[18%] z-0 w-[20%] rotate-[24deg] opacity-90" />

      <div
        className="envelope-scene relative z-[1] aspect-[34/22] w-full"
        onClick={state === 'closed' ? onRequestOpen : undefined}
      >
        {/* Interior / parte trasera */}
        <div className="env-layer env-back" />

        {/* Carta */}
        <motion.div
          className="paper-sheet absolute inset-x-[6%] top-[7%] bottom-[5%] z-[2] flex flex-col items-center px-4 pt-[7%] text-center"
          initial={false}
          animate={flapOpen ? { y: '-56%' } : { y: 0 }}
          transition={{ duration: reduce ? 0 : 0.95, ease: EASE }}
          onAnimationComplete={() => {
            if (flapOpen) onOpened()
          }}
        >
          <svg viewBox="0 0 80 20" className="w-12 opacity-80" aria-hidden="true">
            <path d="M6 12 C26 2 54 2 74 12" fill="none" stroke="#949a7c" strokeWidth="1.2" />
            {[16, 28, 40, 52, 64].map((x, i) => (
              <ellipse key={x} cx={x} cy={i === 2 ? 5 : 7 + Math.abs(2 - i)} rx="3" ry="5" fill={i % 2 ? '#a66f70' : '#949a7c'} opacity=".8" />
            ))}
          </svg>
          <p className="mt-1 font-display text-[clamp(1.05rem,4.6vw,1.35rem)] font-medium italic leading-tight text-cafe">
            {cardTitle}
          </p>
          <p className="font-hand text-[clamp(1.1rem,4.8vw,1.4rem)] leading-none text-vino">
            {cardNote}
          </p>
        </motion.div>

        {/* Bolsillo frontal */}
        <div className="env-layer env-pocket z-[3]">
          <svg
            viewBox="0 0 340 220"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <path d="M0 220 L170 120 L340 220" fill="none" stroke="#b89f86" strokeWidth="1" opacity=".55" />
            <path d="M0 0 L170 119 L340 0" fill="none" stroke="#c9b29a" strokeWidth=".8" opacity=".5" />
          </svg>
        </div>

        {/* Solapa */}
        <motion.div
          className="absolute inset-x-0 top-0 h-[58%] origin-top"
          style={{
            zIndex: flapOpen ? 1 : 4,
            filter: 'drop-shadow(0 2px 2px rgb(85 72 61 / .22))',
          }}
          initial={false}
          animate={{ rotateX: isOpening ? 180 : 0 }}
          transition={{ duration: reduce ? 0 : 0.75, delay: reduce ? 0 : 0.3, ease: EASE }}
          onAnimationComplete={() => {
            if (isOpening) setFlapOpen(true)
          }}
        >
          <div className="env-flap-face" />
        </motion.div>

        {/* Sello de cera */}
        <motion.div
          className="absolute left-1/2 top-[58%] z-[5] w-[19%] -translate-x-1/2 -translate-y-1/2"
          initial={false}
          animate={
            isOpening
              ? { opacity: 0, scale: 1.15, y: -8 }
              : { opacity: 1, scale: 1, y: 0 }
          }
          transition={{ duration: reduce ? 0 : 0.35, ease: 'easeOut' }}
        >
          <WaxSeal className="w-full drop-shadow-[0_2px_2px_rgb(60_30_30/0.35)]" />
        </motion.div>
      </div>
    </div>
  )
}
