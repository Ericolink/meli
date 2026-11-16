import { ChevronDown } from 'lucide-react'
import { motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { EnvelopeIntro, type EnvelopeState } from '../../components/EnvelopeIntro/EnvelopeIntro'
import { FernSprig, PressedFlower } from '../../components/DecorativeElements'
import { site, welcome } from '../../data/content'
import { useAudio } from '../../hooks/useAudio'
import { scrollToId } from '../../utils/scroll'
import { StickerSlot } from '../../components/DecorativeSticker/StickerSlot'

const EASE = [0.22, 1, 0.36, 1] as const

interface WelcomeSectionProps {
  /** Ancla a la que se desplaza al abrir el regalo. */
  nextId: string
}

export function WelcomeSection({ nextId }: WelcomeSectionProps) {
  const [state, setState] = useState<EnvelopeState>('closed')
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const { start: startMusic } = useAudio()

  // Se llama dentro del gesto del usuario (requisito de los navegadores para el audio).
  const open = useCallback(() => {
    if (state !== 'closed') return
    setState('opening')
    startMusic()
  }, [state, startMusic])

  const handleOpened = useCallback(() => {
    setState('open')
    timer.current = window.setTimeout(() => scrollToId(nextId), 900)
  }, [nextId])

  const handleButton = () => {
    if (state === 'closed') open()
    else scrollToId(nextId)
  }

  return (
    <section
      id="bienvenida"
      aria-labelledby="bienvenida-titulo"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 pb-[max(4rem,calc(env(safe-area-inset-bottom)+3rem))] pt-[max(3rem,calc(env(safe-area-inset-top)+1.75rem))] text-center sm:px-8"
    >
      {/* Decoración de esquina */}
      <PressedFlower className="pointer-events-none absolute -left-6 top-6 w-20 -rotate-[24deg] opacity-60 sm:left-6 sm:w-28" />
      <FernSprig className="pointer-events-none absolute -right-4 top-10 w-16 rotate-[18deg] opacity-60 sm:right-10 sm:w-24" />
      <StickerSlot section="bienvenida" />

      <motion.p
        className="chapter-kicker"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.1 }}
      >
        {site.projectTitle}
      </motion.p>

      <motion.h1
        id="bienvenida-titulo"
        className="mt-4 max-w-[14ch] text-[2.65rem] leading-[1.02] sm:max-w-none sm:text-6xl md:text-7xl"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
      >
        {welcome.title}
      </motion.h1>

      <motion.p
        className="mx-auto mt-5 max-w-md text-[1.0625rem] leading-relaxed text-cafe/90 sm:text-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.45, ease: EASE }}
      >
        {welcome.subtitle}
      </motion.p>

      <motion.div
        className="mt-2 w-full"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.7, ease: EASE }}
      >
        <EnvelopeIntro
          state={state}
          cardTitle={welcome.cardTitle}
          cardNote={welcome.cardNote}
          onRequestOpen={open}
          onOpened={handleOpened}
          overlay={<StickerSlot section="bienvenida" slot="envelope" />}
        />
      </motion.div>

      <motion.div
        className="mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.05 }}
      >
        <button
          type="button"
          className="btn-ink"
          data-player-avoid
          onClick={handleButton}
          aria-label={state === 'closed' ? 'Abrir mi regalo: abre el sobre' : 'Comenzar a leer'}
        >
          {state === 'closed' ? welcome.button : welcome.buttonOpened}
        </button>
      </motion.div>

      {state === 'open' && (
        <motion.a
          href={`#${nextId}`}
          onClick={(e) => {
            e.preventDefault()
            scrollToId(nextId)
          }}
          className="absolute bottom-[max(1rem,calc(env(safe-area-inset-bottom)+0.5rem))] left-1/2 flex min-h-11 min-w-11 -translate-x-1/2 items-center justify-center text-tinta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          aria-label="Ir al siguiente capítulo"
        >
          <ChevronDown className="ambient--cue h-6 w-6" strokeWidth={1.4} />
        </motion.a>
      )}
    </section>
  )
}
