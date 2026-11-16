import type { ReactNode } from 'react'
import { Ornament } from '../DecorativeElements'
import { Reveal } from '../Reveal/Reveal'

interface ChapterSectionProps {
  id: string
  numeral?: string
  label?: string
  title: string
  subtitle?: string
  intro?: string
  children?: ReactNode
  className?: string
  /** Decoración absoluta detrás del contenido. */
  decoration?: ReactNode
}

/** Contenedor común de capítulo: encabezado tipo diario + contenido. */
export function ChapterSection({
  id,
  numeral,
  label,
  title,
  subtitle,
  intro,
  children,
  className = '',
  decoration,
}: ChapterSectionProps) {
  const headingId = `${id}-titulo`
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`relative overflow-x-clip scroll-mt-4 px-5 py-24 sm:px-8 md:py-32 ${className}`}
    >
      {decoration}
      <div className="relative mx-auto max-w-5xl">
        <header className="mx-auto max-w-2xl text-center">
          {numeral && (
            <Reveal offset={10}>
              <p className="chapter-kicker">
                Capítulo {numeral}
                {label && <span className="sr-only">: {label}</span>}
              </p>
            </Reveal>
          )}
          <Reveal delay={0.08}>
            <h2
              id={headingId}
              className="mt-4 text-[2.5rem] leading-[1.05] sm:text-6xl md:text-[4.25rem]"
            >
              {title}
            </h2>
          </Reveal>
          {subtitle && (
            <Reveal delay={0.16}>
              <p className="mt-3 font-display text-2xl italic text-vino sm:text-3xl">{subtitle}</p>
            </Reveal>
          )}
          <Reveal delay={0.2} offset={8}>
            <Ornament className="mx-auto mt-6 w-40 sm:w-48" />
          </Reveal>
          {intro && (
            <Reveal delay={0.26}>
              <p className="mx-auto mt-6 max-w-xl text-[1.0625rem] text-cafe/90 sm:text-lg">
                {intro}
              </p>
            </Reveal>
          )}
        </header>
        {children}
      </div>
    </section>
  )
}
