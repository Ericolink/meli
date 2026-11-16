import { useContext } from 'react'
import { AudioContext, type AudioApi } from '../context/audio'

export function useAudio(): AudioApi {
  const ctx = useContext(AudioContext)
  if (!ctx) throw new Error('useAudio debe usarse dentro de <AudioProvider>')
  return ctx
}
