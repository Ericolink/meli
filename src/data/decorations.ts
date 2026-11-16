import type { ChapterId } from './content'
import type { Decoration, DecorationAsset, DecorationSlot } from '../types/decorations'
import manifest from './decorations.manifest.json'

/**
 * STICKERS Y DECORACIONES
 * ------------------------------------------------------------------
 * Para añadir una decoración:
 *   1. Copia la imagen en public/decorations/<categoría>/
 *      (flowers, animal-crossing, anime, objects, misc).
 *   2. Ejecuta  npm run decorations
 *      → recorta el fondo si es uniforme, la optimiza a WebP y la deja en
 *        public/decorations/processed/<categoría>-<nombre>.webp
 *        (revisa docs/decorations-report.md).
 *   3. Añade aquí una entrada. Ejemplo:
 *
 *   {
 *     id: 'acnh-01',
 *     src: '/decorations/processed/animal-crossing-isabelle.webp',
 *     category: 'animal-crossing',
 *     section: 'bienvenida',          // bienvenida | logro | recuerdos | admiro | mundo | carta | final
 *     slot: 'section',                // ver DecorationSlot en src/types/decorations.ts
 *     position: 'top-right',          // preset o { top: '10%', right: '-1rem' }
 *     mobile: { top: '4.5rem', right: '0.5rem' },   // o false para ocultarla en móvil
 *     tier: 'secundario',             // principal | secundario | detalle (o size: xs…xl / rem)
 *     rotation: -8,
 *     enter: 'pop',                   // entrada: none | pop | stick | fade
 *     animation: 'float',             // movimiento: none | float | sway | drift
 *   },
 *
 * Capas:
 *   layer 'sticker'    → encima del papel, con sombra (por defecto).
 *   layer 'background' → detrás del contenido, más suave (opacidad 0.5 por defecto).
 *
 * Todas son decorativas: no reciben clics (pointer-events: none), no se
 * descargan hasta acercarse a la pantalla y nunca desplazan el contenido.
 */
const P = '/decorations/processed/'
const ISABELLE = `${P}animal-crossing-canelita.webp`
const GATITO_AC = `${P}animal-crossing-image.webp`
const MIKASA = `${P}anime-image.webp`
const MIKU = `${P}anime-image-copy.webp`
const MITSURI = `${P}anime-image-copy-2.webp`
const MELODY = `${P}anime-image-copy-3.webp`
const TACITA = `${P}object-image.webp`
const GATITO = `${P}object-image-copy.webp`

export const decorations: Decoration[] = [
  /* ---------- Portada: un personaje asomándose junto al sobre ---------- */
  {
    id: 'bienvenida-isabelle',
    src: ISABELLE,
    category: 'animal-crossing',
    section: 'bienvenida',
    slot: 'envelope',
    position: { bottom: '-1.4rem', right: '-3.4rem' },
    mobile: { bottom: '-1.6rem', right: '-0.9rem' },
    tier: 'secundario',
    mobileSize: 'xs',
    rotation: 8,
    enter: 'stick',
    animation: 'sway',
  },

  /* ---------- El logro: celebrando junto al diploma ---------- */
  {
    id: 'logro-mitsuri',
    src: MITSURI,
    category: 'anime',
    section: 'logro',
    slot: 'diploma',
    position: { bottom: '-7.25rem', right: '-1.75rem' },
    mobile: { bottom: '-3.4rem', right: '-0.4rem' },
    tier: 'secundario',
    mobileSize: 'sm',
    rotation: 6,
    enter: 'pop',
    animation: 'drift',
  },

  /* ---------- Álbum: pequeños personajes en los huecos entre fotos ---------- */
  {
    id: 'recuerdos-miku',
    src: MIKU,
    category: 'anime',
    section: 'recuerdos',
    slot: 'gallery',
    position: { top: '-0.75rem', right: '10%' },
    mobile: { top: '-1.35rem', right: '0.25rem' },
    tier: 'secundario',
    mobileSize: 3.5,
    rotation: -5,
    enter: 'fade',
    animation: 'float',
  },
  {
    id: 'recuerdos-gatito-ac',
    src: GATITO_AC,
    category: 'animal-crossing',
    section: 'recuerdos',
    slot: 'gallery',
    position: { bottom: '-3.5rem', right: '18%' },
    mobile: false,
    tier: 'detalle',
    rotation: 7,
    enter: 'pop',
    animation: 'sway',
  },

  /* ---------- Cualidades: un detalle distinto en la esquina de cada tarjeta ---------- */
  {
    id: 'card-esfuerzo-tacita',
    src: TACITA,
    category: 'object',
    section: 'admiro',
    slot: 'card-esfuerzo',
    position: { top: '-1.1rem', right: '-0.9rem' },
    tier: 'detalle',
    rotation: 10,
    enter: 'pop',
    animation: 'float',
  },
  {
    id: 'card-inteligencia-mikasa',
    src: MIKASA,
    category: 'anime',
    section: 'admiro',
    slot: 'card-inteligencia',
    position: { top: '-1.3rem', right: '-0.7rem' },
    tier: 'detalle',
    rotation: -8,
    enter: 'pop',
  },
  {
    id: 'card-carino-melody',
    src: MELODY,
    category: 'anime',
    section: 'admiro',
    slot: 'card-carino',
    position: { top: '-1.1rem', right: '-0.9rem' },
    tier: 'detalle',
    rotation: 9,
    enter: 'pop',
    animation: 'sway',
  },
  {
    id: 'card-belleza-gatito',
    src: GATITO,
    category: 'object',
    section: 'admiro',
    slot: 'card-belleza',
    position: { top: '-1.3rem', right: '-0.8rem' },
    tier: 'detalle',
    rotation: -7,
    enter: 'pop',
    animation: 'drift',
  },

  /* ---------- Psicología infantil: un animalito sentado en el borde de la lámina ---------- */
  {
    id: 'mundo-gatito',
    src: GATITO,
    category: 'object',
    section: 'mundo',
    slot: 'illustration',
    position: { bottom: '2.4rem', left: '-6.75rem' },
    // en móvil, sobre la esquina superior (junto a la cinta) para no tapar la escena
    mobile: { top: '-2.4rem', left: '-0.5rem' },
    tier: 'principal',
    mobileSize: 3.8,
    rotation: -6,
    enter: 'stick',
    animation: 'sway',
  },

  /* ---------- Carta: un detalle discreto junto a la firma ---------- */
  {
    id: 'carta-tacita',
    src: TACITA,
    category: 'object',
    section: 'carta',
    slot: 'signature',
    position: { bottom: '0', left: '0' },
    mobile: { bottom: '0.1rem', left: '0' },
    tier: 'secundario',
    mobileSize: 'xs',
    rotation: -6,
    enter: 'fade',
  },

  /* ---------- Pantalla final: composición más decorativa ---------- */
  {
    id: 'final-isabelle',
    src: ISABELLE,
    category: 'animal-crossing',
    section: 'final',
    slot: 'message',
    position: { top: '-1.75rem', left: '1.5rem' },
    mobile: { top: '0', left: '0.25rem' },
    tier: 'secundario',
    mobileSize: 'xs',
    rotation: -8,
    enter: 'fade',
    animation: 'float',
  },
  {
    id: 'final-melody',
    src: MELODY,
    category: 'anime',
    section: 'final',
    slot: 'message',
    position: { top: '15rem', right: '-7.5rem' },
    mobile: { top: '0.4rem', right: '0.25rem' },
    tier: 'principal',
    mobileSize: 3.5,
    rotation: 8,
    enter: 'pop',
    animation: 'drift',
  },
  {
    id: 'final-miku',
    src: MIKU,
    category: 'anime',
    section: 'final',
    slot: 'message',
    position: { bottom: '0.25rem', left: '-5.5rem' },
    mobile: false,
    tier: 'secundario',
    rotation: 4,
    enter: 'fade',
    animation: 'sway',
  },
  {
    id: 'final-gatito-ac',
    src: GATITO_AC,
    category: 'animal-crossing',
    section: 'final',
    slot: 'message',
    position: { bottom: '3.5rem', right: '-5rem' },
    // en móvil, a la izquierda: la esquina derecha la ocupa el reproductor
    mobile: { bottom: '-0.25rem', left: '0.5rem' },
    tier: 'secundario',
    mobileSize: 'xs',
    rotation: -6,
    enter: 'pop',
    animation: 'float',
  },
]

/* ------------------------------------------------------------------ */

const assets = new Map((manifest as DecorationAsset[]).map((a) => [a.src, a]))

/** Datos de la imagen procesada (dimensiones, tipo) si existe en el manifiesto. */
export function assetFor(src: string): DecorationAsset | undefined {
  return assets.get(src)
}

export function decorationsFor(section: ChapterId, slot: DecorationSlot = 'section'): Decoration[] {
  return decorations
    .filter((d) => d.visible !== false && d.section === section && (d.slot ?? 'section') === slot)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}
