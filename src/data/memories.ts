import type { Memory } from '../types/memories'

/**
 * ÁLBUM DE RECUERDOS
 * ------------------------------------------------------------------
 * 1. Copia tus fotografías en  public/recuerdos/
 * 2. Añade aquí un objeto por foto con su ruta (src), un texto alternativo
 *    (alt) y sus dimensiones reales en píxeles (width / height).
 *    En Linux/macOS puedes verlas con:  identify foto.jpeg
 * 3. "title" y "description" son opcionales: si están vacíos no se muestra
 *    nada (la foto habla por sí sola).
 * 4. Cambia "order" para reordenarlas.
 *
 * Si un archivo no existe, la página muestra un marco decorativo en su lugar
 * y la foto no se puede ampliar; nada se rompe. Recomendado: .webp o .jpeg,
 * lado mayor ~1600 px y menos de ~400 KB por foto.
 */
export const memories: Memory[] = [
  {
    id: 'melissa-01',
    src: '/recuerdos/melissa-01.jpeg',
    alt: 'Melissa con vestido rosa, tomándose una foto frente a un espejo',
    title: '',
    description: '',
    category: 'melissa',
    order: 1,
    width: 960,
    height: 1280,
  },
  {
    id: 'recuerdo-01',
    src: '/recuerdos/recuerdo-01.jpeg',
    alt: 'Melissa y yo juntos al aire libre, vestidos de gala',
    title: '',
    description: '',
    category: 'juntos',
    order: 2,
    width: 1280,
    height: 960,
  },
  {
    id: 'melissa-02',
    src: '/recuerdos/melissa-02.jpeg',
    alt: 'Melissa con diadema de orejas rojas, tomándose una foto frente a un espejo',
    title: '',
    description: '',
    category: 'melissa',
    order: 3,
    width: 1179,
    height: 1164,
  },
  {
    id: 'recuerdo-02',
    src: '/recuerdos/recuerdo-02.jpeg',
    alt: 'Melissa y yo sonriendo juntos en una selfie',
    title: '',
    description: '',
    category: 'juntos',
    order: 4,
    width: 1600,
    height: 900,
  },
]

export const sortedMemories = [...memories].sort((a, b) => a.order - b.order)
