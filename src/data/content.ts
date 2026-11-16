/**
 * CONTENIDO EDITABLE
 * ------------------------------------------------------------------
 * Todos los textos de la experiencia viven aquí. Cada párrafo es un
 * elemento del arreglo; para añadir o quitar un párrafo basta con
 * añadir o quitar una línea.
 */

export const site = {
  name: 'Melissa',
  projectTitle: 'Un mundo por descubrir',
  mainPhrase:
    'Hay personas que tienen una manera especial de hacer del mundo un lugar más bonito. Espero que nunca pierdas esa parte de ti.',
  year: 2026,
}

/**
 * Música de fondo. Coloca la canción en  public/audio/background.mp3
 * Empieza al pulsar «Abrir mi regalo», con un fundido suave, y se repite.
 * Si el archivo no existe, el reproductor simplemente no aparece.
 */
export const music = {
  src: '/audio/background.mp3',
  /** Volumen final tras el fundido de entrada (0–1). */
  volume: 0.5,
  /** Duración del fundido de entrada, en milisegundos. */
  fadeInMs: 3000,
  label: 'música',
}

/** Capítulos: id del ancla, numeral y nombre corto (indicador de progreso). */
export const chapters = [
  { id: 'bienvenida', numeral: 'I', label: 'La bienvenida' },
  { id: 'logro', numeral: 'II', label: 'El logro' },
  { id: 'recuerdos', numeral: 'III', label: 'El álbum de recuerdos' },
  { id: 'admiro', numeral: 'IV', label: 'Lo que admiro de ti' },
  { id: 'mundo', numeral: 'V', label: 'Un mundo por descubrir' },
  { id: 'carta', numeral: 'VI', label: 'La carta final' },
  { id: 'final', numeral: '', label: 'El comienzo' },
] as const

export type ChapterId = (typeof chapters)[number]['id']

export const welcome = {
  title: 'Melissa, esto es para ti.',
  subtitle:
    'A veces hay momentos que merecen algo más que un simple mensaje de felicitación. Preparé algo pequeño para ti.',
  button: 'Abrir mi regalo',
  buttonOpened: 'Comenzar a leer',
  /** Texto de la tarjeta que sale del sobre. */
  cardTitle: 'Un mundo por descubrir',
  cardNote: 'para Melissa',
}

export const graduation = {
  title: 'Lo lograste.',
  subtitle: 'Licenciada en Psicología',
  paragraphs: [
    'No todos los días se termina una carrera universitaria.',
    'Sé que detrás de este logro hay esfuerzo, dedicación, retos y momentos en los que probablemente las cosas no fueron tan sencillas.',
    'Pero llegaste hasta aquí.',
    'Espero que puedas mirar todo lo que has conseguido y sentirte profundamente orgullosa de ti misma.',
  ],
  closing: '¡Muchas felicidades por este logro, Melissa!',
  /**
   * Fotografía opcional que se sujeta al diploma (p. ej. de la graduación).
   * Si el archivo no existe, simplemente no se muestra.
   */
  photo: {
    src: '/recuerdos/graduacion.jpeg',
    alt: 'Melissa sonriendo con varios ramos de flores y su diploma',
    width: 1179,
    height: 1156,
  },
}

export const memoriesIntro = {
  title: 'Pequeños momentos, grandes recuerdos.',
  text: 'Hay momentos que merecen quedarse guardados. Esta es una pequeña colección de recuerdos que quería compartir contigo.',
}

export const qualities = {
  title: 'Lo bonito de ser tú.',
  text: 'Hay muchas cosas que hacen especial a una persona. Estas son algunas de las que admiro de ti.',
  hint: 'toca para descubrir',
  cards: [
    {
      id: 'esfuerzo',
      icon: 'sprout',
      title: 'Tu esfuerzo',
      description:
        'Porque cuando algo te importa, eres capaz de dedicarle tiempo, energía y corazón.',
    },
    {
      id: 'inteligencia',
      icon: 'book',
      title: 'Tu inteligencia',
      description:
        'Porque tienes mucho que aportar y un mundo de cosas que todavía puedes aprender.',
    },
    {
      id: 'carino',
      icon: 'hand',
      title: 'Tu cariño',
      description:
        'Porque tu manera de tratar a los demás es una de esas cosas que hacen que alguien sea especial.',
    },
    {
      id: 'belleza',
      icon: 'flower',
      title: 'Tu belleza',
      description:
        'Porque eres muy bonita, pero también porque tienes una manera de ser que te hace aún más especial.',
    },
  ],
} as const

export const future = {
  title: 'Pequeños mundos, grandes posibilidades.',
  illustrationCaption: 'Un lugar donde los pequeños mundos son escuchados',
  paragraphs: [
    'Me parece muy bonito que hayas elegido un camino como la Psicología infantil.',
    'Trabajar con niños significa tener la oportunidad de escuchar, comprender y acompañar a personas que todavía están descubriendo el mundo y aprendiendo a entender sus emociones.',
    'Espero que esta nueva etapa te traiga muchísimas satisfacciones, que encuentres personas que valoren tu trabajo y que puedas ayudar a muchos pequeños a crecer sintiéndose comprendidos y queridos.',
  ],
  closing:
    'Nunca dejes de aprender, de soñar y de confiar en lo que eres capaz de hacer.',
}

export const letter = {
  title: 'Unas palabras para ti.',
  greeting: 'Melissa:',
  paragraphs: [
    'Quería aprovechar este momento para felicitarte de una manera un poquito diferente.',
    'Me alegra mucho saber que has conseguido algo por lo que trabajaste tanto. Independientemente de cómo hayan cambiado las cosas con el tiempo, hay algo que no cambia: el cariño y el aprecio que te tengo.',
    'Fuiste y sigues siendo una persona importante para mí, y por eso me hace feliz poder celebrar tus logros, incluso si ahora nos toca hacerlo desde lugares diferentes.',
    'Deseo sinceramente que te vaya increíble en esta nueva etapa. Que encuentres muchas oportunidades, que nunca pierdas esa inteligencia, esa sensibilidad y ese cariño que te caracterizan, y que puedas convertirte en la profesional que sueñas ser.',
    'Espero que nunca dudes de lo mucho que vales y de todo lo que puedes conseguir.',
    'No sé qué caminos nos tenga preparados la vida, pero sí sé que me dará mucho gusto verte crecer, cumplir tus metas y ser feliz.',
    'Felicidades por tu graduación, Melissa. Te lo mereces.',
  ],
  signature: 'Con mucho cariño.',
}

export const closing = {
  title: 'Y esto es solo el comienzo...',
  text: 'Que nunca te falten motivos para sonreír, sueños por cumplir y personas que te recuerden lo increíble que eres.',
  highlight: '¡Felicidades, Melissa!',
  signature: 'Hecho con mucho cariño para ti.',
  backToTop: 'Volver al inicio',
}
