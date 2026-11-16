import { BookOpen, Flower2, HandHeart, Sprout, type LucideIcon } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { BotanicalSprig } from '../DecorativeElements'

const ICONS: Record<string, LucideIcon> = {
  sprout: Sprout,
  book: BookOpen,
  hand: HandHeart,
  flower: Flower2,
}

interface MemoryCardProps {
  icon: string
  title: string
  description: string
  hint: string
  index: number
}

/** Tarjeta de papel que se voltea al tocarla para revelar su mensaje. */
export function MemoryCard({ icon, title, description, hint, index }: MemoryCardProps) {
  const [flipped, setFlipped] = useState(false)
  const reduce = useReducedMotion()
  const Icon = ICONS[icon] ?? Flower2
  const tilt = [-1.2, 1, -0.6, 1.4][index % 4]

  return (
    <button
      type="button"
      className="flip-card group block h-[15.5rem] w-full text-center sm:h-[17rem]"
      style={{ transform: `rotate(${tilt}deg)` }}
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      aria-label={flipped ? `${title}. ${description}` : `${title}. Toca para revelar el mensaje`}
    >
      <motion.span
        className="flip-inner block"
        initial={false}
        animate={reduce ? { opacity: 1 } : { rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Anverso */}
        <span
          className="flip-face paper-aged flex flex-col items-center justify-center px-6 transition-opacity duration-300"
          style={reduce ? { opacity: flipped ? 0 : 1 } : undefined}
          aria-hidden="true"
        >
          <span className="pointer-events-none absolute inset-2.5 rounded-[2px] border border-rosa/30" />
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-rosa/40 bg-crema/60 text-vino transition-transform duration-500 group-hover:scale-105">
            <Icon className="h-7 w-7" strokeWidth={1.2} />
          </span>
          <span className="mt-5 block font-display text-[1.9rem] font-medium leading-none text-cafe">
            {title}
          </span>
          <span className="absolute inset-x-0 bottom-5 block font-hand text-[1.05rem] leading-none text-tinta-oscura/90">{hint}</span>
        </span>

        {/* Reverso */}
        <span
          className={`flip-face paper-sheet flex flex-col items-center justify-center px-7 transition-opacity duration-300 ${reduce ? '' : 'flip-back'}`}
          style={reduce ? { opacity: flipped ? 1 : 0 } : undefined}
          aria-hidden="true"
        >
          <BotanicalSprig className="absolute -right-1 -top-3 h-20 w-8 rotate-[38deg] opacity-70" />
          <span className="block font-display text-xl font-semibold italic text-vino">{title}</span>
          <span className="mx-auto mt-2 block h-px w-10 bg-rosa/50" />
          <span className="mt-3 block text-[1.02rem] leading-relaxed text-cafe">{description}</span>
        </span>
      </motion.span>
    </button>
  )
}
