import { motion } from 'motion/react'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import { scrollToId } from '../../utils/scroll'

interface Chapter {
  id: string
  label: string
}

interface ProgressIndicatorProps {
  chapters: readonly Chapter[]
}

/** Barra de progreso superior + índice discreto de capítulos (escritorio). */
export function ProgressIndicator({ chapters }: ProgressIndicatorProps) {
  const { progress, activeId } = useScrollProgress(chapters.map((c) => c.id))

  return (
    <>
      {/* Línea de tinta separada de los bordes: Safari (iOS 26) no la toma como color de su barra */}
      <div
        className="pointer-events-none fixed left-3 right-3 top-[calc(env(safe-area-inset-top)+3px)] z-40 h-[2px] overflow-hidden rounded-full bg-cafe/[0.07]"
        aria-hidden="true"
      >
        <motion.div className="h-full origin-left rounded-full bg-vino/75" style={{ scaleX: progress }} />
      </div>

      <nav
        aria-label="Secciones"
        className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 md:block lg:right-7"
      >
        <ol className="flex flex-col items-end gap-1">
          {chapters.map((c) => {
            const active = c.id === activeId
            return (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToId(c.id)
                  }}
                  aria-current={active ? 'step' : undefined}
                  className="group flex h-8 items-center gap-3 rounded-full pl-3 pr-1"
                >
                  <span className="pointer-events-none translate-x-1 whitespace-nowrap font-display text-[0.95rem] italic text-cafe opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
                    {c.label}
                  </span>
                  <span
                    className={`block rounded-full transition-all duration-500 ${
                      active ? 'h-2.5 w-2.5 bg-vino' : 'h-1.5 w-1.5 bg-tinta/60 group-hover:bg-rosa'
                    }`}
                    aria-hidden="true"
                  />
                </a>
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
