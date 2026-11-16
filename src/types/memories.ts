/** Categoría de cada fotografía del álbum. */
export type MemoryCategory = 'melissa' | 'juntos'

export interface Memory {
  /** Identificador único (se usa como key de React). */
  id: string
  /** Ruta pública de la imagen, p. ej. "/recuerdos/melissa-01.jpg". */
  src: string
  /** Texto alternativo descriptivo para lectores de pantalla. */
  alt: string
  /** Título breve manuscrito bajo la foto. Déjalo vacío ("") para no mostrar nada. */
  title?: string
  /** Descripción opcional que aparece al ampliar la foto. */
  description?: string
  category: MemoryCategory
  /** Orden de aparición (menor = primero). */
  order: number
  /**
   * Dimensiones reales de la foto en píxeles. Sirven para que el marco tenga
   * exactamente su proporción (sin recortes ni deformación) y para evitar
   * saltos de diseño. Si faltan, el marco usa 4:5.
   */
  width?: number
  height?: number
}

export type ImageStatus = 'pending' | 'loaded' | 'error'

/** Proporción ancho/alto de una foto (4:5 por defecto). */
export function memoryRatio(m: Pick<Memory, 'width' | 'height'>) {
  return m.width && m.height ? m.width / m.height : 4 / 5
}
