import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { AnimatePresence, motion, type PanInfo } from 'motion/react'
import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { Memory } from '../../types/memories'
import { Tape } from '../DecorativeElements'

interface PhotoModalProps {
  /** Fotografías navegables (solo las que cargaron correctamente). */
  items: Memory[]
  activeId: string | null
  onClose: () => void
  onChange: (id: string) => void
}

const FOCUSABLE = 'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'

export function PhotoModal({ items, activeId, onClose, onChange }: PhotoModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const index = items.findIndex((m) => m.id === activeId)
  const item = index >= 0 ? items[index] : null
  const isOpen = item !== null
  const canNavigate = items.length > 1

  const go = useCallback(
    (dir: 1 | -1) => {
      if (!canNavigate || index < 0) return
      onChange(items[(index + dir + items.length) % items.length].id)
    },
    [canNavigate, index, items, onChange],
  )

  // Bloqueo de scroll del fondo y foco inicial
  useEffect(() => {
    if (!isOpen) return
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => closeRef.current?.focus(), 30)
    return () => {
      document.body.style.overflow = overflow
      window.clearTimeout(t)
    }
  }, [isOpen])

  // Teclado: Escape, flechas y trampa de foco
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowRight') {
        go(1)
      } else if (e.key === 'ArrowLeft') {
        go(-1)
      } else if (e.key === 'Tab' && dialogRef.current) {
        const nodes = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
        if (nodes.length === 0) return
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        const active = document.activeElement
        if (e.shiftKey && (active === first || !dialogRef.current.contains(active))) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && (active === last || !dialogRef.current.contains(active))) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose, go])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -70) go(1)
    else if (info.offset.x > 70) go(-1)
  }

  const titleId = 'foto-modal-titulo'

  return createPortal(
    <AnimatePresence>
      {item && (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-50 flex items-center justify-center overscroll-contain bg-[#2b221c]/85 px-4 py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative flex max-h-full w-full max-w-3xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="fixed right-[max(0.75rem,calc(env(safe-area-inset-right)+0.5rem))] top-[max(0.75rem,calc(env(safe-area-inset-top)+0.5rem))] z-10 flex h-12 w-12 items-center justify-center rounded-full bg-crema text-cafe shadow-lg transition-colors hover:bg-white sm:right-6 sm:top-6"
              aria-label="Cerrar fotografía"
            >
              <X className="h-5 w-5" strokeWidth={1.8} />
            </button>

            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={item.id}
                className="polaroid relative flex max-h-[calc(100svh-8rem)] max-w-full flex-col !p-3 !pb-4 sm:!p-4 sm:!pb-5"
                initial={{ opacity: 0, scale: 0.96, rotate: -1.5 }}
                animate={{ opacity: 1, scale: 1, rotate: -0.6 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                drag={canNavigate ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.35}
                onDragEnd={onDragEnd}
              >
                <Tape className="-top-3 left-1/2 -translate-x-1/2 rotate-[-2deg]" />
                <img
                  src={item.src}
                  alt={item.alt}
                  className="min-h-0 max-h-[calc(100svh-14rem)] w-auto max-w-full select-none object-contain"
                  draggable={false}
                  style={{ filter: 'sepia(.08) saturate(.95)' }}
                />
                <figcaption className="mx-auto max-w-prose px-1 pt-3 text-center">
                  <p
                    id={titleId}
                    className={item.title ? 'font-hand text-2xl leading-tight text-cafe' : 'sr-only'}
                  >
                    {item.title || item.alt}
                  </p>
                  {item.description && (
                    <p className="mt-1 text-[0.95rem] leading-relaxed text-tinta-oscura">
                      {item.description}
                    </p>
                  )}
                </figcaption>
              </motion.figure>
            </AnimatePresence>

            {canNavigate && (
              <div className="mt-5 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-crema/90 text-cafe transition-colors hover:bg-crema"
                  aria-label="Fotografía anterior"
                >
                  <ChevronLeft className="h-5 w-5" strokeWidth={1.8} />
                </button>
                <p className="min-w-16 text-center font-display text-lg text-crema/90" aria-live="polite">
                  {index + 1} / {items.length}
                </p>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-crema/90 text-cafe transition-colors hover:bg-crema"
                  aria-label="Fotografía siguiente"
                >
                  <ChevronRight className="h-5 w-5" strokeWidth={1.8} />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
