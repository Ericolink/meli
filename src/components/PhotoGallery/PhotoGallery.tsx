import { useCallback, useMemo, useRef, useState } from 'react'
import { memoryRatio, type ImageStatus, type Memory } from '../../types/memories'
import { PhotoModal } from '../PhotoModal/PhotoModal'
import { Reveal } from '../Reveal/Reveal'
import { Polaroid } from './Polaroid'

interface PhotoGalleryProps {
  items: Memory[]
}

/**
 * Distribución tipo scrapbook. En móvil las fotos horizontales ocupan el ancho
 * completo (ligeramente desplazadas) y las verticales/cuadradas van de dos en dos;
 * en pantallas medianas todo se reparte en dos columnas.
 */
const OFFSETS = ['', 'md:mt-16', 'mt-6 md:mt-0', 'md:mt-10', 'md:-mt-4', 'md:mt-8']
const WIDE_SHIFT = ['mr-auto', 'ml-auto']

function isWide(m: Memory) {
  return memoryRatio(m) >= 1.2
}

export function PhotoGallery({ items }: PhotoGalleryProps) {
  const [status, setStatus] = useState<Record<string, ImageStatus>>({})
  const [activeId, setActiveId] = useState<string | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  const handleStatus = useCallback((id: string, s: ImageStatus) => {
    setStatus((prev) => (prev[id] === s ? prev : { ...prev, [id]: s }))
  }, [])

  const handleOpen = useCallback((id: string, trigger: HTMLElement) => {
    triggerRef.current = trigger
    setActiveId(id)
  }, [])

  const handleClose = useCallback(() => {
    setActiveId(null)
    // Devolver el foco a la foto que abrió el modal
    window.setTimeout(() => triggerRef.current?.focus({ preventScroll: true }), 0)
  }, [])

  const viewable = useMemo(() => items.filter((m) => status[m.id] === 'loaded'), [items, status])

  return (
    <>
      <ul className="mx-auto mt-16 grid max-w-[46rem] grid-flow-row-dense grid-cols-2 items-start gap-x-5 gap-y-12 px-1 sm:gap-x-8 md:mt-20 md:gap-x-14 md:gap-y-16 lg:gap-x-20">
        {items.map((m, i) => {
          const wide = isWide(m)
          return (
            <li
              key={m.id}
              className={`${OFFSETS[i % OFFSETS.length]} ${wide ? 'col-span-2 md:col-span-1' : ''}`}
            >
              <Reveal
                delay={(i % 2) * 0.1}
                offset={26}
                amount={0.2}
                className={wide ? `w-[90%] md:w-full ${WIDE_SHIFT[i % 2]}` : ''}
              >
                <Polaroid
                  memory={m}
                  index={i}
                  status={status[m.id] ?? 'pending'}
                  onStatus={handleStatus}
                  onOpen={handleOpen}
                />
              </Reveal>
            </li>
          )
        })}
      </ul>

      <PhotoModal items={viewable} activeId={activeId} onClose={handleClose} onChange={setActiveId} />
    </>
  )
}
