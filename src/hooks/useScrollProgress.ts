import { useScroll, useSpring, type MotionValue } from 'motion/react'
import { useEffect, useState } from 'react'

interface ScrollProgress {
  /** Progreso global del documento (0–1), suavizado. */
  progress: MotionValue<number>
  /** id de la sección que ocupa el centro de la pantalla. */
  activeId: string
}

export function useScrollProgress(sectionIds: readonly string[]): ScrollProgress {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })
  const [activeId, setActiveId] = useState(sectionIds[0] ?? '')
  const key = sectionIds.join('|')

  useEffect(() => {
    const ids = key.split('|')
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el)
    if (els.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      // Franja estrecha en el centro de la pantalla
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [key])

  return { progress, activeId }
}
