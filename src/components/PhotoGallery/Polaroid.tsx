import { memo, type CSSProperties } from 'react'
import { memoryRatio, type ImageStatus, type Memory } from '../../types/memories'
import { PressedFlower, Tape } from '../DecorativeElements'

const ROTATIONS = [-3.2, 2.4, -1.4, 3, -2.2, 1.6, -2.8, 2]
const TAPES = [
  'left-1/2 -top-3 -translate-x-1/2 rotate-[-3deg]',
  '-left-4 top-1 rotate-[-38deg]',
  'left-1/2 -top-3 -translate-x-1/2 rotate-[4deg]',
  '-right-4 top-1 rotate-[36deg]',
]

interface PolaroidProps {
  memory: Memory
  index: number
  status: ImageStatus
  onStatus: (id: string, status: ImageStatus) => void
  onOpen: (id: string, trigger: HTMLElement) => void
}

/** Fotografía con marco Polaroid; muestra un marco decorativo si la imagen no existe. */
function PolaroidBase({ memory, index, status, onStatus, onOpen }: PolaroidProps) {
  const rotation = ROTATIONS[index % ROTATIONS.length]
  const tape = TAPES[index % TAPES.length]
  const ratio = memoryRatio(memory)
  const loaded = status === 'loaded'
  const broken = status === 'error'

  const frame = (
    <>
      <Tape className={tape} variant={index % 3 === 1 ? 'rosa' : 'beige'} />
      <div className="polaroid-photo" style={{ aspectRatio: ratio }}>
        {/* Marco decorativo de respaldo (visible mientras carga o si falta el archivo) */}
        <div
          className="absolute inset-0 flex items-center justify-center bg-[#e9ddcc] transition-opacity duration-700"
          style={{ opacity: loaded ? 0 : 1 }}
          aria-hidden="true"
        >
          <div className="absolute inset-3 border border-dashed border-rosa/30" />
          <PressedFlower
            className="h-[62%] opacity-60"
            style={{ transform: `rotate(${rotation * -4}deg)` }}
            petal={index % 2 ? '#b98a87' : '#a66f70'}
          />
        </div>
        {!broken && (
          <img
            src={memory.src}
            alt={memory.alt}
            width={memory.width ?? 800}
            height={memory.height ?? 1000}
            loading="lazy"
            decoding="async"
            className="relative transition-opacity duration-700"
            style={{ opacity: loaded ? 1 : 0 }}
            onLoad={() => onStatus(memory.id, 'loaded')}
            onError={() => onStatus(memory.id, 'error')}
          />
        )}
      </div>
      {memory.title ? (
        <p className="absolute inset-x-2 bottom-2 truncate text-center font-hand text-[1.35rem] leading-none text-cafe">
          {memory.title}
        </p>
      ) : null}
    </>
  )

  return (
    <button
      type="button"
      disabled={!loaded}
      aria-hidden={!loaded || undefined}
      className="polaroid block w-full rotate-[var(--r)] text-left transition-transform duration-500 ease-[var(--ease-paper)] enabled:hover:-translate-y-1 enabled:hover:rotate-0 enabled:focus-visible:rotate-0 disabled:cursor-default"
      style={{ '--r': `${rotation}deg` } as CSSProperties}
      onClick={(e) => onOpen(memory.id, e.currentTarget)}
      aria-label={loaded ? `Ampliar fotografía: ${memory.title || memory.alt}` : undefined}
      aria-haspopup="dialog"
    >
      {frame}
    </button>
  )
}

export const Polaroid = memo(PolaroidBase)
