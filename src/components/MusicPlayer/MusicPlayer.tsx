import { Music2, Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState, type CSSProperties } from 'react'
import { useAudio } from '../../hooks/useAudio'

interface MusicPlayerProps {
  label: string
}

/** Pequeño reproductor flotante de papel. Solo aparece si la canción cargó. */
export function MusicPlayer({ label }: MusicPlayerProps) {
  const { status, muted, volume, volumeSupported, toggle, toggleMute, setVolume } = useAudio()
  const ready = status === 'playing' || status === 'paused'
  // No aparece mientras se vea un botón marcado con data-player-avoid (p. ej. el de la portada)
  const avoiding = useAvoidedInView(ready)
  const visible = ready && !avoiding
  const playing = status === 'playing'
  const audible = playing && !muted
  const scrolling = useIsScrolling(visible)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="player"
          role="group"
          aria-label="Reproductor de música"
          className={`music-player fixed bottom-[max(0.9rem,calc(env(safe-area-inset-bottom)+0.5rem))] left-[max(0.75rem,calc(env(safe-area-inset-left)+0.5rem))] z-40 flex h-12 items-center gap-1 rounded-full py-1 pl-1 pr-1.5 transition-opacity duration-500 sm:left-5 sm:h-[3.25rem] sm:gap-2 sm:pr-3 ${scrolling ? 'max-md:opacity-35' : ''}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <button
            type="button"
            onClick={toggle}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-vino text-crema shadow-[0_3px_8px_-3px_rgb(120_62_70/0.7)] transition-transform hover:scale-[1.04] active:scale-95 sm:h-11 sm:w-11"
            aria-label={playing ? 'Pausar la música' : 'Reanudar la música'}
          >
            {playing ? (
              <Pause className="h-4 w-4" strokeWidth={2} fill="currentColor" aria-hidden="true" />
            ) : (
              <Play className="ml-0.5 h-4 w-4" strokeWidth={2} fill="currentColor" aria-hidden="true" />
            )}
          </button>

          {/* Indicador de reproducción */}
          <span className="flex items-center gap-1.5 pl-1 text-cafe" aria-hidden="true">
            <Music2 className="hidden h-3.5 w-3.5 text-rosa sm:block" strokeWidth={1.6} />
            <span className={`eq ${audible ? 'is-playing' : ''}`}>
              {[0, 1, 2, 3].map((i) => (
                <span key={i} style={{ '--i': i } as CSSProperties} />
              ))}
            </span>
            <span className="hidden font-hand text-lg leading-none text-cafe sm:inline">{label}</span>
          </span>

          <button
            type="button"
            onClick={toggleMute}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-cafe transition-colors hover:bg-beige/40 hover:text-vino"
            aria-label={muted ? 'Activar el sonido' : 'Silenciar'}
            aria-pressed={muted}
          >
            {muted ? (
              <VolumeX className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.6} aria-hidden="true" />
            ) : (
              <Volume2 className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.6} aria-hidden="true" />
            )}
          </button>

          {volumeSupported && (
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="volume-range hidden w-20 sm:block"
              aria-label="Volumen"
              aria-valuetext={`${Math.round((muted ? 0 : volume) * 100)} %`}
            />
          )}

          <span className="sr-only" aria-live="polite">
            {playing ? 'Música en reproducción' : 'Música en pausa'}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * true mientras el usuario desplaza la página (y ~1 s después). En móvil el
 * reproductor se atenúa durante el scroll para no tapar textos ni fotografías.
 */
function useIsScrolling(enabled: boolean) {
  const [scrolling, setScrolling] = useState(false)
  useEffect(() => {
    if (!enabled) return
    let timer = 0
    const onScroll = () => {
      setScrolling(true)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setScrolling(false), 1000)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(timer)
    }
  }, [enabled])
  return scrolling
}

/**
 * true mientras algún elemento con [data-player-avoid] esté visible en pantalla.
 * Hasta recibir la primera medición se asume visible, para no mostrar el
 * reproductor un instante encima del botón.
 */
function useAvoidedInView(enabled: boolean) {
  const [inView, setInView] = useState<boolean | null>(null)
  useEffect(() => {
    if (!enabled) return
    const targets = document.querySelectorAll('[data-player-avoid]')
    if (targets.length === 0) {
      const id = requestAnimationFrame(() => setInView(false))
      return () => cancelAnimationFrame(id)
    }
    const visibleSet = new Set<Element>()
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visibleSet.add(e.target)
        else visibleSet.delete(e.target)
      }
      setInView(visibleSet.size > 0)
    })
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [enabled])
  return inView !== false
}
