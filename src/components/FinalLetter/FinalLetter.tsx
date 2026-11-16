import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { PressedFlower, Postmark, WildflowerSprig } from '../DecorativeElements'

interface FinalLetterProps {
  greeting: string
  paragraphs: readonly string[]
  signature: string
  year: number
}

const EASE = [0.22, 1, 0.36, 1] as const

/** Carta sobre papel antiguo; cada párrafo aparece al llegar a él. */
export function FinalLetter({ greeting, paragraphs, signature, year }: FinalLetterProps) {
  const signRef = useRef<HTMLDivElement>(null)
  const signed = useInView(signRef, { once: true, amount: 0.8 })

  return (
    <article className="relative mx-auto mt-14 max-w-2xl md:mt-20">
      {/* hoja inferior desplazada: sensación de varias hojas */}
      <div className="paper-aged absolute inset-0 translate-x-1 translate-y-2 rotate-[0.8deg]" aria-hidden="true" />

      <div className="paper-sheet relative -rotate-[0.4deg] px-7 pb-16 pt-14 sm:px-14 md:px-20 md:pb-20 md:pt-16">
        <Postmark className="pointer-events-none absolute right-4 top-4 w-20 rotate-[14deg] opacity-80 sm:right-8 sm:top-6 sm:w-24" />
        <WildflowerSprig className="pointer-events-none absolute -left-3 -top-8 w-10 -rotate-[30deg] sm:-left-6 sm:w-12" />

        <p className="font-hand text-xl text-tinta-oscura" aria-hidden="true">
          {year}
        </p>

        <motion.p
          className="mt-6 font-display text-[2rem] font-medium italic leading-none text-vino sm:text-4xl"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 1 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          {greeting}
        </motion.p>

        <div className="mt-7 space-y-6 text-[1.0625rem] leading-[1.9] text-cafe sm:text-[1.125rem]">
          {paragraphs.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.1, ease: EASE }}
            >
              {p}
            </motion.p>
          ))}
        </div>

        <div ref={signRef} className="mt-12 flex flex-col items-end pr-1">
          <motion.p
            className="font-hand text-[2.4rem] leading-none text-vino sm:text-5xl"
            initial={{ opacity: 0 }}
            animate={signed ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
          >
            {signature}
          </motion.p>
          <svg viewBox="0 0 220 30" className="mt-1 w-44 sm:w-52" aria-hidden="true">
            <path
              className={`ink-draw ${signed ? 'is-drawn' : ''}`}
              style={{ ['--len' as string]: 260, animationDelay: '.6s' }}
              d="M6 18 C40 8 70 24 104 16 C132 10 150 8 170 14 C186 19 196 22 214 10"
              fill="none"
              stroke="#783e46"
              strokeWidth="1.6"
              strokeLinecap="round"
              opacity=".75"
            />
          </svg>
        </div>

        <PressedFlower className="pointer-events-none absolute -bottom-6 left-4 w-14 rotate-[-58deg] opacity-90 sm:left-10 sm:w-16" />
      </div>
    </article>
  )
}
