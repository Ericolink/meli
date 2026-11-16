# Un mundo por descubrir

Experiencia web de graduación para Melissa: un diario vintage con sobre, diploma ilustrado, álbum de fotos, tarjetas, un pequeño mundo ilustrado y una carta final.

React 19 · TypeScript · Vite · Tailwind CSS 4 · Motion · Lucide.

## Ejecutar localmente

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # genera dist/
npm run preview    # sirve dist/ en http://localhost:4173
npm run lint       # oxlint
```

## Música de fondo

Coloca la canción en **`public/audio/background.mp3`** (con ese nombre exacto, o cambia la ruta en `src/data/content.ts` → `music.src`).

- Empieza al pulsar «Abrir mi regalo», con un fundido de entrada de 3 s, y se repite en bucle.
- Antes de ese clic no se descarga nada.
- Hay un único `HTMLAudioElement` para toda la página, así que navegar entre capítulos no reinicia la canción.
- El reproductor flotante (abajo a la derecha) permite pausar, reanudar y silenciar. En pantallas medianas y grandes también tiene un control de volumen. En iPhone el volumen solo se controla con los botones del teléfono, por eso ahí no aparece el control.
- Si cierras la pestaña o bloqueas el teléfono, la música se pausa y se reanuda al volver.
- Si el archivo no existe o no se puede reproducir, el reproductor no aparece y la página funciona igual.
- El volumen final y la duración del fundido se ajustan en `music.volume` y `music.fadeInMs`.
- Recomendado: MP3 a 128 kbps, de unos 3–5 MB como máximo.

## Agregar fotografías

1. Copia las fotos en `public/recuerdos/`.
2. Edita `src/data/memories.ts`. Para cada foto:
   - `src`: la ruta exacta, respetando la extensión (p. ej. `/recuerdos/melissa-01.jpeg`)
   - `alt`: una descripción para lectores de pantalla
   - `width` / `height`: dimensiones reales en píxeles (`identify foto.jpeg`). El marco toma exactamente esa proporción, así que nada se recorta ni se deforma. Las fotos horizontales ocupan todo el ancho en móvil.
   - `title`: texto manuscrito bajo la Polaroid (`''` para no mostrar nada)
   - `description`: texto que aparece al ampliar (opcional)
   - `category`: `'melissa'` o `'juntos'`
   - `order`: orden de aparición
3. Para añadir o quitar fotos, añade o borra objetos del arreglo.

Si un archivo no existe, se muestra un marco decorativo con una flor prensada en su lugar, que no se puede ampliar.

**Foto de graduación:** `public/recuerdos/graduacion.jpeg` aparece sujeta con cinta junto al diploma y se puede ampliar. Su ruta y dimensiones están en `src/data/content.ts` → `graduation.photo`.

**Orientación:** si una foto aparece girada, corrige el archivo (por ejemplo `convert foto.jpeg -rotate 180 foto.jpeg`).

## Stickers y decoraciones

1. Copia la imagen en `public/decorations/<categoría>/` (`flowers`, `animal-crossing`, `anime`, `objects`, `misc`).
2. Ejecuta `npm run decorations` (requiere Python 3 con Pillow y numpy). El script:
   - Recorta el fondo si es uniforme (blanco, negro o de un color liso). Conserva los blancos interiores, como los ojos, y elimina el halo.
   - Añade un borde blanco tipo sticker a los personajes y objetos.
   - Optimiza a WebP con un lado máximo de 520 px y lo guarda en `public/decorations/processed/`. Los originales no se tocan.
   - Si el fondo no es uniforme, no recorta la imagen y la muestra como una tarjetita de papel.
   - Deja un informe en `docs/decorations-report.md`.
3. Añade una entrada en `src/data/decorations.ts`:
   - `section`: dónde aparece.
   - `slot`: la zona concreta (`section`, `envelope`, `diploma`, `gallery`, `card-<id>`, `illustration`, `letter`, `signature`, `message`).
   - `position` y `mobile`: la posición en escritorio y en móvil (`false` la oculta en móvil).
   - `tier`: el tamaño, con tres niveles. `principal` (6,2→9 rem), `secundario` (4,6→6,2 rem) y `detalle` (3,2→4,1 rem: flores, estrellas, corazones).
   - `rotation`: la inclinación.
   - `enter`: la animación de entrada (`pop`, `stick`, `fade`).
   - `animation`: el movimiento continuo (`float`, `sway`, `drift`).

Los stickers no reciben clics, se cargan al acercarse a la pantalla y quedan quietos si el sistema tiene activado «reducir movimiento». Cada uno tiene su propia duración y su propio retraso, así que no se mueven sincronizados.

## Cambiar textos

Todos los textos están en `src/data/content.ts`, agrupados por capítulo (`welcome`, `graduation`, `memoriesIntro`, `qualities`, `future`, `letter`, `closing`). Cada párrafo es un elemento del arreglo `paragraphs`.

## Estructura

```
src/
  components/   EnvelopeIntro, ChapterSection, PhotoGallery (+Polaroid), PhotoModal,
                MemoryCard, MusicPlayer, ProgressIndicator, FinalLetter,
                DecorativeElements, Reveal
  context/      AudioProvider (audio global) y su contexto
  components/DecorativeSticker/  DecorativeSticker + StickerSlot
  sections/     Welcome (+Prelude), Graduation (+Diploma), Memories, Qualities,
                Future (+ListeningScene: ilustración SVG), Letter, Closing (+FallingPetals)
  data/         content.ts, memories.ts, decorations.ts (+ manifest generado)
  hooks/        useScrollProgress.ts, useAudio.ts
  styles/       global.css (tokens, papel, componentes), animations.css
  types/        memories.ts
  utils/        scroll.ts
public/
  recuerdos/    fotografías
  audio/        background.mp3 (canción)
  decorations/  imágenes originales por categoría + processed/
scripts/        process-decorations.py
  robots.txt, _headers, favicon.svg
vercel.json
```

## Publicar

Es un sitio estático (`dist/`).

- **Vercel:** importa el proyecto. Detecta Vite automáticamente (build `npm run build`, salida `dist`). `vercel.json` añade la cabecera `X-Robots-Tag: noindex`.
- **Netlify — insignia «Powered by Netlify»:** la añade Netlify desde sus servidores (no está en el código). Se desactiva en *Project configuration → General → Powered by Netlify badge*. Se aplica en la siguiente visita, sin volver a desplegar. El reproductor está en la esquina inferior izquierda, así que la insignia (abajo a la derecha) no lo tapa aunque esté activa.
- **Netlify:** build `npm run build` y carpeta de publicación `dist`. También puedes arrastrar `dist/` a app.netlify.com/drop. `public/_headers` añade `noindex`.
- **Cloudflare Pages:** framework «Vite», build `npm run build`, salida `dist`. También usa `_headers`.

## iPhone / Safari

- `viewport-fit=cover` y `env(safe-area-inset-*)` en la portada, la pantalla final, el reproductor, la barra de progreso, el modal y los laterales (horizontal).
- El color de fondo declarado, el `theme-color` y el tono visible del papel coinciden (`--color-papel-base`), para que las barras de Safari continúen el papel sin franjas.
- La barra de progreso no toca los bordes, para que Safari no la use como color de su barra superior.

## Privacidad

- No hay analíticas, cookies, formularios ni contadores.
- `robots.txt`, la meta `robots` y la cabecera `X-Robots-Tag` piden a los buscadores que no indexen la página.
- **Ojo:** `noindex` no hace privada la página. Cualquiera que tenga el enlace puede abrirla. No publiques información sensible.
- Las tipografías se cargan desde Google Fonts, así que el navegador de quien la visite hace una petición a Google.
# meli
