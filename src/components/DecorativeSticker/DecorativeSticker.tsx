import { motion, type TargetAndTransition, type Transition } from 'motion/react'
import { useState, type CSSProperties } from 'react'
import type {
  DecorationAnimation,
  DecorationEnter,
  DecorationSize,
  DecorationTier,
  Placement,
  PositionCoords,
} from '../../types/decorations'

/** Ancho en rem: [móvil, escritorio]. */
const SIZES: Record<Exclude<DecorationSize, number>, [number, number]> = {
  xs: [3.2, 4.1],
  sm: [4.6, 6.2],
  md: [6.2, 9],
  lg: [7.5, 11.5],
  xl: [9.5, 15],
}

const TIER_SIZE: Record<DecorationTier, Exclude<DecorationSize, number>> = {
  principal: 'md',
  secundario: 'sm',
  detalle: 'xs',
}

const PRESETS: Record<Exclude<Placement, PositionCoords>, PositionCoords> = {
  'top-left': { top: '-0.75rem', left: '-0.75rem' },
  'top-right': { top: '-0.75rem', right: '-0.75rem' },
  'bottom-left': { bottom: '-0.75rem', left: '-0.75rem' },
  'bottom-right': { bottom: '-0.75rem', right: '-0.75rem' },
  top: { top: '-1.25rem', left: 'calc(50% - var(--deco-w) / 2)' },
  bottom: { bottom: '-1.25rem', left: 'calc(50% - var(--deco-w) / 2)' },
  left: { top: '40%', left: '-1rem' },
  right: { top: '40%', right: '-1rem' },
}

/** Rango de duración (s) de cada movimiento continuo. */
const LOOP_RANGE: Record<Exclude<DecorationAnimation, 'none'>, [number, number]> = {
  float: [3, 5],
  sway: [4, 6],
  drift: [5, 6.5],
}

function coords(p: Placement): PositionCoords {
  return typeof p === 'string' ? PRESETS[p] : p
}

function widths(size: DecorationSize, mobileSize?: DecorationSize): [number, number] {
  const desktop = typeof size === 'number' ? size : SIZES[size][1]
  if (mobileSize !== undefined) {
    const mobile = typeof mobileSize === 'number' ? mobileSize : SIZES[mobileSize][0]
    return [mobile, desktop]
  }
  return [typeof size === 'number' ? size * 0.72 : SIZES[size][0], desktop]
}

/** Número pseudoaleatorio estable (0–1) a partir de un texto: evita que se muevan sincronizados. */
function seeded(text: string, salt: number) {
  let h = 2166136261 ^ salt
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619)
  return ((h >>> 0) % 1000) / 1000
}

export interface DecorativeStickerProps {
  /** Identificador estable (varía duración y retraso de la animación). */
  id?: string
  src: string
  /** '' = decorativa (oculta a lectores de pantalla). */
  alt?: string
  className?: string
  rotation?: number
  tier?: DecorationTier
  size?: DecorationSize
  mobileSize?: DecorationSize
  opacity?: number
  /** Posición en ≥768 px. */
  position: Placement
  /** Posición en móvil; false = oculta en móvil. */
  mobile?: Placement | false
  animation?: DecorationAnimation
  enter?: DecorationEnter
  duration?: number
  delay?: number
  layer?: 'sticker' | 'background'
  /** 'card' = imagen sin recortar, se muestra como tarjetita de papel. */
  variant?: 'cutout' | 'card'
  /** Dimensiones reales (evitan saltos de diseño). */
  width?: number
  height?: number
  /** Sección a la que pertenece (informativo, útil para depurar). */
  section?: string
  zIndex?: number
}

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Sticker o decoración pegada sobre el papel. Siempre es decorativa:
 * posicionada en absoluto, sin eventos de puntero y con carga diferida.
 * Solo anima transform y opacity.
 */
export function DecorativeSticker({
  id,
  src,
  alt = '',
  className = '',
  rotation = 0,
  tier,
  size,
  mobileSize,
  opacity,
  position,
  mobile,
  animation = 'none',
  enter = 'none',
  duration,
  delay,
  layer = 'sticker',
  variant = 'cutout',
  width,
  height,
  section,
  zIndex,
}: DecorativeStickerProps) {
  const [failed, setFailed] = useState(false)
  if (failed) return null

  const key = id ?? src
  const finalOpacity = opacity ?? (layer === 'background' ? 0.5 : 1)
  const [mw, dw] = widths(size ?? TIER_SIZE[tier ?? 'secundario'], mobileSize)
  const d = coords(position)
  const m = mobile === false ? d : coords(mobile ?? position)

  // Movimiento continuo con duración, retraso y amplitud propios de cada sticker.
  let loopStyle: CSSProperties | undefined
  if (animation !== 'none') {
    const [min, max] = LOOP_RANGE[animation]
    const dur = duration ?? min + seeded(key, 1) * (max - min)
    loopStyle = {
      '--deco-dur': `${dur.toFixed(2)}s`,
      '--deco-delay': `${(delay ?? -seeded(key, 2) * dur).toFixed(2)}s`,
      '--deco-amp': `${(5 + seeded(key, 3) * 4).toFixed(1)}px`,
      '--deco-tilt': `${(2 + seeded(key, 4)).toFixed(1)}deg`,
    } as CSSProperties
  }

  const style = {
    '--m-w': `${mw}rem`,
    '--d-w': `${dw}rem`,
    '--m-top': m.top,
    '--m-right': m.right,
    '--m-bottom': m.bottom,
    '--m-left': m.left,
    '--d-top': d.top,
    '--d-right': d.right,
    '--d-bottom': d.bottom,
    '--d-left': d.left,
    zIndex: zIndex ?? (layer === 'background' ? 0 : 3),
    aspectRatio: width && height ? `${width} / ${height}` : undefined,
  } as CSSProperties

  // Efecto de entrada (una vez): escala + opacidad, 500–800 ms, sin rebotes.
  const target: TargetAndTransition = { opacity: finalOpacity, scale: 1, rotate: rotation }
  const initial =
    enter === 'stick'
      ? { opacity: 0, scale: 1.14, rotate: rotation + 7 }
      : enter === 'pop'
        ? { opacity: 0, scale: 0.82, rotate: rotation }
        : enter === 'fade'
          ? { opacity: 0, scale: 1, rotate: rotation }
          : null
  const transition: Transition = {
    duration: enter === 'stick' ? 0.7 : enter === 'pop' ? 0.6 : 0.8,
    ease: EASE,
    delay: seeded(key, 5) * 0.25,
  }

  const inner =
    variant === 'card' ? (
      <span className="deco-card block h-full w-full">
        <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" onError={() => setFailed(true)} className="block h-full w-full object-cover" />
      </span>
    ) : (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        draggable={false}
        onError={() => setFailed(true)}
        className={`block h-auto w-full select-none ${layer === 'sticker' ? 'deco-shadow' : ''}`}
      />
    )

  return (
    <motion.span
      className={`deco pointer-events-none select-none ${mobile === false ? 'max-md:hidden' : ''} ${className}`}
      style={style}
      initial={initial ?? { opacity: finalOpacity, rotate: rotation }}
      whileInView={initial ? target : undefined}
      viewport={{ once: true, amount: 0.4 }}
      transition={transition}
      aria-hidden={alt ? undefined : true}
      data-section={section}
    >
      <span
        className={`block h-full w-full ${animation !== 'none' ? `deco-loop deco-loop--${animation}` : ''}`}
        style={loopStyle}
      >
        {inner}
      </span>
    </motion.span>
  )
}
