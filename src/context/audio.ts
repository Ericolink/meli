import { createContext } from 'react'

export type AudioStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'unavailable'

export interface AudioApi {
  status: AudioStatus
  muted: boolean
  volume: number
  /** false en dispositivos donde el volumen solo se controla con los botones físicos (iOS). */
  volumeSupported: boolean
  /** Inicia la música (llamar dentro de un gesto del usuario). Idempotente. */
  start: () => void
  toggle: () => void
  toggleMute: () => void
  setVolume: (v: number) => void
}

export const AudioContext = createContext<AudioApi | null>(null)
