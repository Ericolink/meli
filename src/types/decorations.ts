import type { ChapterId } from '../data/content'

export type DecorationCategory = 'flower' | 'animal-crossing' | 'anime' | 'object' | 'misc'

/**
 * Lugar concreto dentro de una sección donde se ancla una decoración.
 * - 'section': toda la sección (márgenes, esquinas, alrededor del título).
 * - el resto son zonas junto a un elemento concreto.
 */
export type DecorationSlot =
  | 'section'
  | 'envelope' // portada: alrededor del sobre
  | 'diploma' // el logro: alrededor del diploma
  | 'gallery' // álbum: entre las fotografías
  | 'card-esfuerzo'
  | 'card-inteligencia'
  | 'card-carino'
  | 'card-belleza'
  | 'illustration' // psicología infantil: alrededor de la lámina
  | 'letter' // carta: alrededor del papel
  | 'signature' // carta: junto a la firma
  | 'message' // pantalla final: alrededor del mensaje

/** Posiciones predefinidas (relativas al slot). */
export type PositionPreset =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'

/** Posición libre en cualquier unidad CSS: { top: '12%', right: '-1.5rem' } */
export interface PositionCoords {
  top?: string
  right?: string
  bottom?: string
  left?: string
}

export type Placement = PositionPreset | PositionCoords

/** Ancho (móvil → escritorio): xs 3.2→4.1rem · sm 4.6→6.2rem · md 6.2→9rem · lg 7.5→11.5rem · xl 9.5→15rem, o un ancho en rem. */
export type DecorationSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number

/**
 * Jerarquía visual (fija el tamaño por defecto):
 * - 'principal'  → md: personajes protagonistas.
 * - 'secundario' → sm: personajes de apoyo.
 * - 'detalle'    → xs: flores, estrellas, corazones y detalles pequeños.
 */
export type DecorationTier = 'principal' | 'secundario' | 'detalle'

/** Movimiento continuo y discreto (se desactiva con «reducir movimiento»). */
export type DecorationAnimation = 'none' | 'float' | 'sway' | 'drift'

/** Efecto al entrar en pantalla (una sola vez). */
export type DecorationEnter = 'none' | 'pop' | 'stick' | 'fade'

export interface Decoration {
  id: string
  /** Ruta pública, normalmente /decorations/processed/<archivo>.webp */
  src: string
  /** Texto alternativo. Vacío ('') = puramente decorativa (recomendado). */
  alt?: string
  category: DecorationCategory
  /** Sección donde aparece (id del capítulo). */
  section: ChapterId
  slot?: DecorationSlot
  /** Posición en tablet/escritorio (≥768 px). */
  position: Placement
  /**
   * Posición en móvil. `false` = no se muestra en móvil.
   * Si se omite, usa la misma que en escritorio.
   */
  mobile?: Placement | false
  /** Nivel de jerarquía; determina el tamaño si no se indica `size`. */
  tier?: DecorationTier
  size?: DecorationSize
  /** Tamaño en móvil (por defecto, la columna móvil del mismo tamaño). */
  mobileSize?: DecorationSize
  /** Grados de rotación. */
  rotation?: number
  opacity?: number
  /** 'sticker' = pegado encima (opaco, con sombra); 'background' = fondo suave, detrás del contenido. */
  layer?: 'sticker' | 'background'
  /**
   * float = flota 5–9 px (3–5 s) · sway = balanceo ±3° (4–6 s) ·
   * drift = flotación + leve giro (5–6.5 s). Duración y retraso se varían
   * automáticamente por sticker para que no se muevan a la vez.
   */
  animation?: DecorationAnimation
  enter?: DecorationEnter
  /** Opcional: fija la duración (s) o el retraso (s) del movimiento continuo. */
  duration?: number
  delay?: number
  /** Orden de apilado dentro del slot (mayor = encima). */
  order?: number
  visible?: boolean
}

/** Entrada del manifiesto generado por scripts/process-decorations.py */
export interface DecorationAsset {
  id: string
  category: string
  src: string
  width: number
  height: number
  kind: 'cutout' | 'card'
  source: string
}
