import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AudioContext, type AudioApi, type AudioStatus } from './audio'

interface AudioProviderProps {
  src: string
  defaultVolume: number
  fadeInMs: number
  children: ReactNode
}

const clamp = (v: number) => Math.min(1, Math.max(0, v))

/**
 * Música de fondo con un único HTMLAudioElement para toda la experiencia.
 * El elemento se crea en el primer gesto del usuario (no se descarga antes).
 */
export function AudioProvider({ src, defaultVolume, fadeInMs, children }: AudioProviderProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeRef = useRef(0)
  const targetRef = useRef(defaultVolume)
  const wantsPlayRef = useRef(false)
  const resumeOnShowRef = useRef(false)
  const volumeSupportedRef = useRef(true)

  const [status, setStatus] = useState<AudioStatus>('idle')
  const [muted, setMuted] = useState(false)
  const [volume, setVolumeState] = useState(defaultVolume)
  const [volumeSupported, setVolumeSupported] = useState(true)

  const fadeTo = useCallback((to: number, ms: number, done?: () => void) => {
    cancelAnimationFrame(fadeRef.current)
    const a = audioRef.current
    if (!a) return
    if (!volumeSupportedRef.current || ms <= 0) {
      if (volumeSupportedRef.current) a.volume = clamp(to)
      done?.()
      return
    }
    const from = a.volume
    const t0 = performance.now()
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / ms)
      const eased = k * k * (3 - 2 * k)
      a.volume = clamp(from + (to - from) * eased)
      if (k < 1) fadeRef.current = requestAnimationFrame(step)
      else done?.()
    }
    fadeRef.current = requestAnimationFrame(step)
  }, [])

  const ensureAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current
    const a = new Audio()
    a.preload = 'auto'
    a.loop = true

    // iOS ignora la propiedad volume: allí solo ofrecemos silenciar.
    a.volume = 0.5
    const supported = Math.abs(a.volume - 0.5) < 0.01
    volumeSupportedRef.current = supported
    setVolumeSupported(supported)

    a.addEventListener('playing', () => setStatus('playing'))
    a.addEventListener('pause', () => setStatus((s) => (s === 'unavailable' ? s : 'paused')))
    a.addEventListener('ended', () => {
      // Respaldo por si loop no se respeta
      if (wantsPlayRef.current) {
        a.currentTime = 0
        void a.play().catch(() => undefined)
      }
    })
    a.addEventListener('error', () => {
      wantsPlayRef.current = false
      setStatus('unavailable')
    })

    a.src = src
    audioRef.current = a
    return a
  }, [src])

  const playWithFade = useCallback(
    (ms: number) => {
      const a = audioRef.current
      if (!a) return
      wantsPlayRef.current = true
      if (volumeSupportedRef.current) a.volume = 0
      a.play()
        .then(() => fadeTo(targetRef.current, ms))
        .catch((err: unknown) => {
          if (a.error) setStatus('unavailable')
          else if (err instanceof DOMException && err.name === 'NotAllowedError') setStatus('paused')
        })
    },
    [fadeTo],
  )

  const start = useCallback(() => {
    if (status === 'unavailable' || status === 'playing') return
    const a = ensureAudio()
    if (!a.paused) return
    setStatus('loading')
    playWithFade(fadeInMs)
  }, [ensureAudio, fadeInMs, playWithFade, status])

  const toggle = useCallback(() => {
    const a = audioRef.current
    if (!a || status === 'unavailable') return
    if (!a.paused && wantsPlayRef.current) {
      wantsPlayRef.current = false
      setStatus('paused')
      fadeTo(0, 450, () => a.pause())
    } else {
      playWithFade(900)
    }
  }, [fadeTo, playWithFade, status])

  const toggleMute = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    a.muted = !a.muted
    setMuted(a.muted)
  }, [])

  const setVolume = useCallback((v: number) => {
    const a = audioRef.current
    const value = clamp(v)
    targetRef.current = value
    setVolumeState(value)
    if (!a) return
    cancelAnimationFrame(fadeRef.current)
    a.volume = value
    if (value > 0 && a.muted) {
      a.muted = false
      setMuted(false)
    }
  }, [])

  // Pausa al ocultar la pestaña / bloquear el teléfono y reanuda al volver.
  useEffect(() => {
    const onVisibility = () => {
      const a = audioRef.current
      if (!a) return
      if (document.hidden) {
        if (!a.paused) {
          resumeOnShowRef.current = true
          a.pause()
        }
      } else if (resumeOnShowRef.current && wantsPlayRef.current) {
        resumeOnShowRef.current = false
        playWithFade(800)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [playWithFade])

  useEffect(
    () => () => {
      cancelAnimationFrame(fadeRef.current)
      audioRef.current?.pause()
    },
    [],
  )

  const api = useMemo<AudioApi>(
    () => ({ status, muted, volume, volumeSupported, start, toggle, toggleMute, setVolume }),
    [status, muted, volume, volumeSupported, start, toggle, toggleMute, setVolume],
  )

  return <AudioContext.Provider value={api}>{children}</AudioContext.Provider>
}
