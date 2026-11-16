import { useInView } from 'motion/react'
import { useId, useRef } from 'react'

/* ------------------------------------------------------------------
   «Un lugar donde los pequeños mundos son escuchados»
   Ilustración estilo cuento vintage (viewBox 800×480).
   - Las capas estáticas usan filtros de acuarela (bordes irregulares).
   - Las capas animadas quedan fuera de los filtros para no recalcularlos.
   ------------------------------------------------------------------ */

const C = {
  ink: '#6e5646',
  skinA: '#ecc8ad',
  skinB: '#f1cfb6',
  skinShade: '#ddb093',
  hairA: '#6b4838',
  hairB: '#93603f',
  rosa: '#c99a93',
  rosaDeep: '#a66f70',
  vino: '#783e46',
  salvia: '#a3aa88',
  salviaDeep: '#878f6c',
  beige: '#d9c5b5',
  cream: '#f6ecdc',
  paper: '#fbf6ec',
  wood: '#b9936d',
  woodDeep: '#9c7552',
  mustard: '#e0c07f',
  dusty: '#9fb0b1',
}

/** Banderines del banderín: puntos sobre una curva cuadrática. */
const BUNTING = [0.08, 0.2, 0.32, 0.44, 0.56, 0.68, 0.8, 0.92].map((t, i) => {
  const [x0, y0, x1, y1, x2, y2] = [250, 56, 405, 92, 560, 56]
  const u = 1 - t
  return {
    x: u * u * x0 + 2 * u * t * x1 + t * t * x2,
    y: u * u * y0 + 2 * u * t * y1 + t * t * y2,
    color: [C.rosa, C.salvia, C.mustard, C.dusty][i % 4],
    delay: -i * 0.6,
  }
})

const SHELF1_BOOKS = [
  { w: 10, h: 50, c: C.rosa },
  { w: 13, h: 56, c: C.salvia },
  { w: 9, h: 44, c: C.mustard },
  { w: 12, h: 53, c: C.dusty },
  { w: 11, h: 48, c: C.rosaDeep },
  { w: 8, h: 42, c: C.beige },
]
const SHELF2_BOOKS = [
  { w: 9, h: 50, c: C.dusty },
  { w: 12, h: 54, c: C.rosa },
  { w: 10, h: 46, c: C.salviaDeep },
]

/** Añade la coordenada x de cada libro colocándolos uno junto a otro. */
function placeBooks(books: { w: number; h: number; c: string }[], startX: number) {
  return books.map((b, i) => ({
    ...b,
    x: startX + books.slice(0, i).reduce((acc, prev) => acc + prev.w + 1.5, 0),
  }))
}
const SHELF1 = placeBooks(SHELF1_BOOKS, 612)
const SHELF2 = placeBooks(SHELF2_BOOKS, 664)

function Face({ x, y, r, color, mood }: { x: number; y: number; r: number; color: string; mood: 'feliz' | 'triste' | 'sorpresa' | 'calma' }) {
  const mouth = {
    feliz: `M${x - r * 0.45} ${y + r * 0.2} Q${x} ${y + r * 0.7} ${x + r * 0.45} ${y + r * 0.2}`,
    triste: `M${x - r * 0.4} ${y + r * 0.55} Q${x} ${y + r * 0.1} ${x + r * 0.4} ${y + r * 0.55}`,
    sorpresa: '',
    calma: `M${x - r * 0.35} ${y + r * 0.38} L${x + r * 0.35} ${y + r * 0.38}`,
  }[mood]
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={color} />
      <circle cx={x - r * 0.35} cy={y - r * 0.15} r={r * 0.11} fill={C.ink} />
      <circle cx={x + r * 0.35} cy={y - r * 0.15} r={r * 0.11} fill={C.ink} />
      {mood === 'sorpresa' ? (
        <ellipse cx={x} cy={y + r * 0.38} rx={r * 0.16} ry={r * 0.22} fill={C.ink} />
      ) : (
        <path d={mouth} fill="none" stroke={C.ink} strokeWidth={r * 0.12} strokeLinecap="round" />
      )}
    </g>
  )
}

export function ListeningScene() {
  const uid = useId().replace(/:/g, '')
  const id = (n: string) => `${uid}-${n}`
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { margin: '0px 0px -10% 0px' })

  return (
    <svg
      ref={ref}
      viewBox="0 0 800 480"
      preserveAspectRatio="xMidYMid slice"
      className={`block h-full w-full ${inView ? '' : 'is-paused'}`}
      role="img"
      aria-labelledby={id('t')}
    >
      <title id={id('t')}>
        Una psicóloga sentada en el suelo, a la altura de un niño, lo escucha con una sonrisa mientras él le muestra su
        dibujo. Alrededor hay tarjetas de emociones, bloques y juguetes de madera, una pequeña biblioteca con libros
        ilustrados, dibujos infantiles en la pared, plantas y una ventana con luz cálida.
      </title>

      <defs>
        {/* Bordes de acuarela: ligera ondulación */}
        <filter id={id('rough')} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id={id('edge')} x="-3%" y="-3%" width="106%" height="106%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" seed="11" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="16" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {/* Granulado del pigmento y manchas de agua */}
        <filter id={id('grain')} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="2" />
          <feColorMatrix values="0 0 0 0 .42  0 0 0 0 .33  0 0 0 0 .25  0 0 0 .22 0" />
        </filter>
        <filter id={id('wash')} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="3" seed="21" />
          <feColorMatrix values="0 0 0 0 .62  0 0 0 0 .47  0 0 0 0 .36  0 0 0 1.1 -.42" />
        </filter>

        <linearGradient id={id('sky')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbf1d8" />
          <stop offset="1" stopColor="#f3dcae" />
        </linearGradient>
        <linearGradient id={id('beam')} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#fcefcf" stopOpacity=".9" />
          <stop offset="1" stopColor="#fcefcf" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={id('glow')} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fbe9c2" stopOpacity=".95" />
          <stop offset="1" stopColor="#fbe9c2" stopOpacity="0" />
        </radialGradient>
        <pattern id={id('wallpaper')} width="34" height="34" patternUnits="userSpaceOnUse">
          <path d="M8 10 q3 -5 6 0 q-3 5 -6 0Z" fill={C.salvia} opacity=".32" />
          <circle cx="25" cy="26" r="1.6" fill={C.rosa} opacity=".38" />
        </pattern>
        <clipPath id={id('glass')}>
          <path d="M90 236 V140 A55 55 0 0 1 200 140 V236 Z" />
        </clipPath>
        <clipPath id={id('shirt')}>
          <path d="M461 336 C469 329 491 329 499 336 C505 351 507 367 505 384 L461 386 C457 369 457 351 461 336Z" />
        </clipPath>
        <clipPath id={id('scene')}>
          <rect x="0" y="0" width="800" height="480" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${id('scene')})`}>
        {/* ============ PARED Y SUELO ============ */}
        <g filter={`url(#${id('edge')})`}>
          <path d="M22 54 C70 26 230 18 400 20 C580 18 730 24 778 58 C792 160 790 300 786 392 L14 392 C10 300 8 160 22 54Z" fill="#eedfca" />
          <path d="M22 54 C70 26 230 18 400 20 C580 18 730 24 778 58 C792 160 790 300 786 392 L14 392 C10 300 8 160 22 54Z" fill={`url(#${id('wallpaper')})`} />
          <path d="M14 392 L786 392 C790 420 788 452 780 474 C600 482 200 482 20 474 C12 452 10 420 14 392Z" fill="#dcc3a3" />
        </g>
        <path d="M16 390 H784" stroke={C.woodDeep} strokeWidth="5" opacity=".35" />
        <g stroke={C.woodDeep} strokeWidth="1" opacity=".22" strokeLinecap="round">
          <path d="M20 414 H780 M18 440 H782 M22 464 H778" />
          <path d="M120 392 V414 M300 414 V440 M520 392 V414 M660 440 V464 M200 440 V464 M700 414 V440" />
        </g>

        {/* Resplandor de la ventana */}
        <circle cx="146" cy="160" r="150" fill={`url(#${id('glow')})`} />

        {/* ============ VENTANA ============ */}
        <g filter={`url(#${id('rough')})`}>
          <path d="M78 246 V138 A67 67 0 0 1 212 138 V246 Z" fill={C.wood} />
          <path d="M90 236 V140 A55 55 0 0 1 200 140 V236 Z" fill={`url(#${id('sky')})`} />
          <g clipPath={`url(#${id('glass')})`}>
            <circle cx="168" cy="146" r="16" fill="#f8e2a4" opacity=".9" />
            <path d="M90 206 C116 190 142 198 166 186 C182 180 194 184 200 188 V236 H90Z" fill="#cfd3b3" />
            <path d="M90 222 C120 208 160 218 200 204 V236 H90Z" fill="#b3bb97" />
            <path d="M116 206 V188" stroke="#8a7a5a" strokeWidth="2" />
            <ellipse cx="116" cy="182" rx="11" ry="13" fill="#9ba47f" />
            <path d="M120 130 q4 -4 8 0 q4 -4 8 0" fill="none" stroke="#8a7a5a" strokeWidth="1.2" />
          </g>
          <path d="M145 86 V236 M90 176 H200" stroke={C.wood} strokeWidth="5" />
          <rect x="66" y="240" width="158" height="11" rx="3" fill={C.woodDeep} />
          {/* maceta en el alféizar */}
          <path d="M178 222 L198 222 L195 240 L181 240Z" fill="#c98f72" />
          <rect x="176" y="219" width="24" height="5" rx="2" fill="#b67c60" />
        </g>
        {/* Cortinas */}
        <path d="M58 64 H234" stroke="#8c6a50" strokeWidth="3" strokeLinecap="round" />
        <circle cx="58" cy="64" r="4" fill="#8c6a50" />
        <circle cx="234" cy="64" r="4" fill="#8c6a50" />
        <g filter={`url(#${id('rough')})`}>
          <path d="M62 66 C70 120 60 190 80 254 C92 258 100 252 96 244 C86 196 92 130 98 66Z" fill={C.rosa} opacity=".92" />
          <path d="M230 66 C222 120 232 190 212 254 C200 258 192 252 196 244 C206 196 200 130 194 66Z" fill={C.rosa} opacity=".92" />
          <path d="M74 80 C78 140 72 200 86 246 M218 80 C214 140 220 200 206 246" stroke={C.rosaDeep} strokeWidth="1" fill="none" opacity=".45" />
        </g>
        {/* Hojas de la maceta del alféizar */}
        <g className="ambient ambient--sway" style={{ animationDuration: '7s' }}>
          <path d="M188 220 C182 206 172 200 166 202 C170 210 178 218 188 220Z" fill={C.salvia} />
          <path d="M189 220 C190 202 198 194 206 194 C204 206 198 214 189 220Z" fill={C.salviaDeep} />
          <path d="M188 220 C186 208 188 198 192 192" stroke={C.salviaDeep} strokeWidth="1.2" fill="none" />
        </g>

        {/* Haz de luz cálida sobre el suelo */}
        <path
          className="ambient ambient--glow"
          d="M92 250 L204 250 L470 478 L150 478Z"
          fill={`url(#${id('beam')})`}
        />

        {/* ============ BANDERINES ============ */}
        <path d="M250 56 Q405 92 560 56" fill="none" stroke="#8c6a50" strokeWidth="1.2" />
        {BUNTING.map((f, i) => (
          <g key={i} transform={`translate(${f.x.toFixed(1)} ${f.y.toFixed(1)})`}>
            <path
              className="ambient ambient--swing"
              style={{ animationDelay: `${f.delay}s` }}
              d="M-8 0 L8 0 L0 18Z"
              fill={f.color}
              opacity=".9"
            />
          </g>
        ))}

        {/* ============ DIBUJOS INFANTILES EN LA PARED ============ */}
        <g filter={`url(#${id('rough')})`}>
          {/* Casa con sol */}
          <g transform="rotate(-4 300 148)">
            <rect x="262" y="104" width="76" height="86" fill={C.paper} />
            <circle cx="320" cy="122" r="8" fill={C.mustard} />
            <path d="M320 108 V104 M332 122 H336 M329 112 L332 109 M311 112 L308 109 M329 131 L332 134" stroke={C.mustard} strokeWidth="2" strokeLinecap="round" />
            <path d="M274 150 L292 134 L310 150Z" fill={C.rosaDeep} />
            <rect x="277" y="150" width="30" height="24" fill={C.rosa} />
            <rect x="288" y="160" width="8" height="14" fill={C.ink} opacity=".7" />
            <path d="M266 178 q6 -6 12 0 q6 -6 12 0 q6 -6 12 0 q6 -6 12 0 q6 -6 12 0 q6 -6 6 0" stroke={C.salviaDeep} strokeWidth="2" fill="none" />
          </g>
          {/* Arcoíris */}
          <g transform="rotate(3 398 131)">
            <rect x="356" y="96" width="84" height="70" fill={C.paper} />
            <path d="M370 150 A28 28 0 0 1 426 150" stroke={C.rosa} strokeWidth="5" fill="none" />
            <path d="M376 150 A22 22 0 0 1 420 150" stroke={C.mustard} strokeWidth="5" fill="none" />
            <path d="M382 150 A16 16 0 0 1 414 150" stroke={C.salvia} strokeWidth="5" fill="none" />
            <path d="M388 150 A10 10 0 0 1 408 150" stroke={C.dusty} strokeWidth="5" fill="none" />
            <path d="M362 152 q3 -7 9 -4 q4 -5 9 0 q4 2 1 6 h-18Z" fill="#fff" stroke={C.beige} />
            <path d="M414 152 q3 -7 9 -4 q4 -5 9 0 q4 2 1 6 h-18Z" fill="#fff" stroke={C.beige} />
          </g>
          {/* Dos figuras de la mano */}
          <g transform="rotate(-2 495 149)">
            <rect x="460" y="108" width="70" height="82" fill={C.paper} />
            <circle cx="482" cy="130" r="7" fill="none" stroke={C.ink} strokeWidth="1.6" />
            <path d="M482 137 V160 M482 160 L475 176 M482 160 L489 176 M472 146 H492" stroke={C.rosaDeep} strokeWidth="2" strokeLinecap="round" />
            <circle cx="508" cy="146" r="5.5" fill="none" stroke={C.ink} strokeWidth="1.6" />
            <path d="M508 152 V166 M508 166 L503 177 M508 166 L513 177 M492 146 L501 156 L515 156" stroke={C.dusty} strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M480 129 h1 M484 129 h1 M479 132 q3 2 6 0 M506 145 h1 M510 145 h1 M506 148 q2 1.5 4 0" stroke={C.ink} strokeWidth="1" strokeLinecap="round" fill="none" />
            <circle cx="520" cy="122" r="3.5" fill={C.mustard} />
            <path d="M520 126 V134" stroke={C.salviaDeep} strokeWidth="1.4" />
          </g>
          {/* Cintas */}
          <g fill="#e5d5c2" opacity=".85">
            <rect x="290" y="96" width="22" height="9" transform="rotate(-8 301 100)" />
            <rect x="388" y="90" width="22" height="9" transform="rotate(6 399 94)" />
            <rect x="484" y="102" width="22" height="9" transform="rotate(-4 495 106)" />
          </g>
        </g>

        {/* ============ BIBLIOTECA ============ */}
        <g filter={`url(#${id('rough')})`}>
          <rect x="606" y="156" width="140" height="236" fill="#dcc5a5" />
          <rect x="598" y="150" width="10" height="244" fill={C.wood} />
          <rect x="744" y="150" width="10" height="244" fill={C.wood} />
          <rect x="590" y="144" width="172" height="10" rx="2" fill={C.woodDeep} />
          {[222, 296, 368].map((y) => (
            <rect key={y} x="606" y={y} width="140" height="7" fill={C.wood} />
          ))}

          {/* Estante 1: libros */}
          {SHELF1.map((b, i) => (
            <g key={i}>
              <rect x={b.x} y={222 - b.h} width={b.w} height={b.h} rx="1.5" fill={b.c} />
              <path d={`M${b.x + 2} ${222 - b.h + 8} h${b.w - 4} M${b.x + 2} ${212} h${b.w - 4}`} stroke="#fff" strokeWidth="1" opacity=".5" />
            </g>
          ))}
          <rect x="690" y="172" width="11" height="50" rx="1.5" fill={C.salvia} transform="rotate(14 695 222)" />

          {/* Estante 2: libro ilustrado de frente + libros + arcoíris de madera */}
          <rect x="614" y="236" width="44" height="58" rx="2" fill="#efdcbc" />
          <rect x="614" y="236" width="5" height="58" fill={C.rosaDeep} />
          <circle cx="644" cy="256" r="8" fill={C.mustard} opacity=".8" />
          <path d="M624 282 C632 270 640 276 648 268 C652 274 654 280 654 286 H624Z" fill={C.salvia} />
          <path d="M626 289 h24" stroke={C.ink} strokeWidth="1" opacity=".4" />
          {SHELF2.map((b, i) => (
            <rect key={i} x={b.x} y={296 - b.h} width={b.w} height={b.h} rx="1.5" fill={b.c} />
          ))}
          <g transform="translate(720 294)">
            <path d="M-20 0 A20 20 0 0 1 20 0 H14 A14 14 0 0 0 -14 0Z" fill={C.rosa} />
            <path d="M-14 0 A14 14 0 0 1 14 0 H8 A8 8 0 0 0 -8 0Z" fill={C.mustard} />
            <path d="M-8 0 A8 8 0 0 1 8 0Z" fill={C.salvia} />
          </g>

          {/* Estante 3: torre de aros, osito */}
          <rect x="616" y="362" width="34" height="6" rx="2" fill={C.woodDeep} />
          <rect x="631" y="320" width="4" height="44" fill={C.woodDeep} />
          <ellipse cx="633" cy="356" rx="15" ry="6" fill={C.rosa} />
          <ellipse cx="633" cy="346" rx="12.5" ry="5.5" fill={C.mustard} />
          <ellipse cx="633" cy="337" rx="10" ry="5" fill={C.salvia} />
          <ellipse cx="633" cy="329" rx="7.5" ry="4.5" fill={C.dusty} />
          <circle cx="633" cy="320" r="4" fill={C.woodDeep} />
          {/* osito */}
          <g transform="translate(700 340)">
            <ellipse cx="0" cy="14" rx="15" ry="14" fill="#c9a07a" />
            <ellipse cx="0" cy="16" rx="8" ry="8" fill="#e2c4a2" />
            <circle cx="-13" cy="24" r="5.5" fill="#c9a07a" />
            <circle cx="13" cy="24" r="5.5" fill="#c9a07a" />
            <circle cx="0" cy="-6" r="12" fill="#c9a07a" />
            <circle cx="-10" cy="-15" r="4.5" fill="#c9a07a" />
            <circle cx="10" cy="-15" r="4.5" fill="#c9a07a" />
            <circle cx="-10" cy="-15" r="2.2" fill="#e2c4a2" />
            <circle cx="10" cy="-15" r="2.2" fill="#e2c4a2" />
            <ellipse cx="0" cy="-2" rx="5" ry="3.8" fill="#e2c4a2" />
            <circle cx="-4.5" cy="-8" r="1.3" fill={C.ink} />
            <circle cx="4.5" cy="-8" r="1.3" fill={C.ink} />
            <circle cx="0" cy="-3.5" r="1.4" fill={C.ink} />
            <path d="M-6 6 L0 9 L6 6 L0 12Z" fill={C.rosaDeep} />
          </g>

          {/* Base: cesta */}
          <path d="M614 376 H680 L676 392 H618Z" fill="#c9a27a" />
          <path d="M620 380 h56 M622 386 h52 M630 376 v16 M644 376 v16 M658 376 v16 M670 376 v16" stroke={C.woodDeep} strokeWidth=".8" opacity=".5" />
          <rect x="690" y="382" width="48" height="8" rx="1.5" fill={C.dusty} />
          <rect x="694" y="375" width="40" height="7" rx="1.5" fill={C.rosa} />

          {/* Maceta sobre la biblioteca */}
          <path d="M716 126 L742 126 L738 146 L720 146Z" fill="#c98f72" />
          <rect x="713" y="122" width="32" height="6" rx="2" fill="#b67c60" />
        </g>
        {/* Hiedra colgante (animada, fuera del filtro) */}
        <g className="ambient ambient--swing" style={{ animationDuration: '8s' }}>
          <path d="M724 124 C712 140 706 160 708 190 C709 206 704 218 700 226" fill="none" stroke={C.salviaDeep} strokeWidth="1.3" />
          {[
            [716, 138, -30],
            [709, 156, 20],
            [708, 176, -24],
            [708, 196, 18],
            [703, 214, -20],
          ].map(([x, y, r], i) => (
            <path key={i} transform={`translate(${x} ${y}) rotate(${r})`} d="M0 0 C-7 -3 -9 -9 -5 -12 C-1 -9 2 -4 0 0Z M0 0 C7 -3 9 -9 5 -12 C1 -9 -2 -4 0 0Z" fill={i % 2 ? C.salvia : C.salviaDeep} />
          ))}
          <path d="M730 124 C736 108 744 102 752 104 C748 114 740 122 730 124Z" fill={C.salvia} />
          <path d="M728 124 C724 110 716 104 710 106 C714 114 720 121 728 124Z" fill={C.salviaDeep} />
        </g>

        {/* ============ PLANTA GRANDE ============ */}
        <g className="ambient ambient--sway" style={{ animationDuration: '9s' }}>
          {[
            'M58 372 C40 340 26 300 30 262 C46 290 56 330 58 372Z',
            'M58 372 C62 330 76 292 98 270 C96 306 80 344 58 372Z',
            'M58 372 C48 326 52 282 66 248 C74 286 70 330 58 372Z',
            'M58 372 C34 352 18 326 12 300 C34 312 50 338 58 372Z',
            'M58 372 C80 352 100 336 118 330 C106 350 84 366 58 372Z',
          ].map((d, i) => (
            <path key={i} d={d} fill={[C.salvia, C.salviaDeep, '#b2b896', C.salviaDeep, C.salvia][i]} />
          ))}
          <path d="M58 372 C56 330 60 290 66 252 M58 372 C46 338 36 300 32 266 M58 372 C70 336 82 300 96 274" stroke="#6f7257" strokeWidth=".8" fill="none" opacity=".5" />
        </g>
        <g filter={`url(#${id('rough')})`}>
          <path d="M30 368 L88 368 L80 418 L38 418Z" fill="#c4876c" />
          <rect x="26" y="362" width="66" height="10" rx="3" fill="#b0745b" />
          <path d="M40 392 q19 6 38 0" stroke="#a96d55" strokeWidth="1.2" fill="none" />
        </g>

        {/* ============ ALFOMBRA Y COJÍN ============ */}
        <g filter={`url(#${id('rough')})`}>
          <ellipse cx="420" cy="430" rx="300" ry="38" fill="#e7cdc2" />
          <ellipse cx="420" cy="430" rx="284" ry="31" fill="none" stroke={C.rosa} strokeWidth="1.4" strokeDasharray="2 7" strokeLinecap="round" />
          <ellipse cx="318" cy="412" rx="84" ry="15" fill={C.salvia} />
          <ellipse cx="318" cy="408" rx="76" ry="10" fill="#b2b896" opacity=".8" />
        </g>

        {/* Taza de té */}
        <g filter={`url(#${id('rough')})`}>
          <ellipse cx="206" cy="414" rx="16" ry="4" fill="#cdb593" opacity=".6" />
          <path d="M194 392 H216 L214 412 C212 416 198 416 196 412Z" fill={C.cream} stroke={C.beige} />
          <path d="M216 396 C224 396 224 406 215 406" fill="none" stroke={C.beige} strokeWidth="2.5" />
          <path d="M197 400 H213" stroke={C.rosa} strokeWidth="2" />
        </g>
        <g fill="none" stroke="#c9b29a" strokeWidth="1.4" strokeLinecap="round">
          <path className="ambient ambient--steam" d="M201 386 q-3 -5 0 -9 q3 -4 0 -8" />
          <path className="ambient ambient--steam" style={{ animationDelay: '-1.6s' }} d="M209 386 q-3 -5 0 -9 q3 -4 0 -8" />
        </g>

        {/* ============ PSICÓLOGA ============ */}
        <g stroke={C.ink} strokeWidth="1.1" strokeLinejoin="round" strokeLinecap="round">
          {/* cabello largo por detrás */}
          <path d="M326 236 C318 264 312 292 302 322 C312 330 328 324 336 306 C340 290 340 274 338 260Z" fill={C.hairA} />
          {/* falda y piernas recogidas */}
          <path d="M298 352 C284 368 262 386 236 396 C222 402 222 413 238 414 L390 414 C400 412 400 402 392 392 C386 376 382 362 378 350Z" fill="#dcc6a8" />
          <path d="M302 372 C296 388 292 400 288 412 M338 364 C336 384 338 398 342 412 M364 362 C368 380 372 396 374 410" fill="none" opacity=".35" />
          <path d="M238 400 C228 398 214 402 214 408 C214 413 226 415 240 412Z" fill="#8c6a55" />
          {/* cuello */}
          <path d="M330 266 L332 288 L348 288 L347 264Z" fill={C.skinA} stroke="none" />
          {/* torso: suéter */}
          <path d="M308 290 C320 281 346 280 364 288 C376 294 382 310 384 330 C386 342 384 352 380 358 L298 358 C294 340 296 306 308 290Z" fill={C.rosa} />
          <path d="M326 284 L338 297 L350 286" fill={C.cream} />
          {/* bajo del suéter */}
          <path d="M298 350 C324 354 354 354 381 349 L380 358 L298 358Z" fill="#bd8a83" />
          <path d="M306 298 C312 320 318 336 318 352" fill="none" opacity=".25" />
          {/* brazo apoyado sobre el regazo */}
          <path d="M311 292 C300 306 296 326 300 346 C303 360 314 367 326 367 L328 356 C318 354 313 344 313 330 C313 316 317 302 320 294Z" fill="#bd8a83" />
          <ellipse cx="333" cy="362" rx="8.5" ry="5.5" fill={C.skinA} />
          {/* brazo delantero, mano abierta hacia el dibujo */}
          <path d="M360 296 C376 300 388 316 396 330 C400 336 404 339 410 340 L408 352 C398 354 388 350 380 340 C372 330 364 320 358 312Z" fill={C.rosa} />
          <path d="M406 339 C414 334 425 334 431 338 C433 341 430 344 426 344 L418 345 C419 349 414 352 407 351Z" fill={C.skinA} />
          <path d="M417 338 L428 338" fill="none" opacity=".4" />
          {/* cabeza inclinada hacia el niño */}
          <g transform="rotate(9 344 262)">
            <ellipse cx="346" cy="246" rx="23" ry="26" fill={C.skinA} />
            <path d="M368 232 C366 214 350 206 335 211 C320 216 314 233 318 252 C320 264 324 272 330 278 C331 264 333 252 339 243 C348 236 360 236 368 232Z" fill={C.hairA} />
            <path d="M367 230 C362 239 354 241 346 239" fill="none" stroke={C.hairA} strokeWidth="3" />
            <ellipse cx="334" cy="252" rx="4" ry="6" fill={C.skinShade} />
            <circle cx="334" cy="260" r="1.8" fill="#c9a36b" stroke="none" />
            {/* rostro amable: mirada baja hacia el dibujo */}
            <path d="M343 248 q3.5 2.6 7 0 M356 248 q3 2.2 6 0" fill="none" stroke="#4a3a32" strokeWidth="1.6" />
            <path d="M342 241 q4 -2 8 0 M356 241 q3 -1.6 6 0" fill="none" stroke={C.hairA} strokeWidth="1.2" opacity=".8" />
            <path d="M365 251 q2.5 4 -1 6" fill="none" stroke="#b98a72" strokeWidth="1.2" />
            <path d="M351 262 q5 4 10 -1" fill="none" stroke="#a0574f" strokeWidth="1.6" />
            <circle cx="360" cy="257" r="4.5" fill="#e0a397" stroke="none" opacity=".45" />
            <circle cx="344" cy="256" r="4" fill="#e0a397" stroke="none" opacity=".35" />
          </g>
        </g>

        {/* ============ NIÑO ============ */}
        <g stroke={C.ink} strokeWidth="1.1" strokeLinejoin="round" strokeLinecap="round">
          {/* piernas de rodillas */}
          <path d="M452 388 C448 401 456 411 472 413 L520 413 C531 413 535 404 529 396 C521 384 509 378 497 376 L468 378 C460 380 454 384 452 388Z" fill={C.dusty} />
          <ellipse cx="526" cy="405" rx="8" ry="6" fill={C.rosaDeep} />
          {/* brazo trasero (sostiene el dibujo por la derecha) */}
          <path d="M496 344 C490 340 476 340 464 342" fill="none" stroke={C.skinB} strokeWidth="7" />
          {/* torso: camiseta de rayas y peto */}
          <path d="M461 336 C469 329 491 329 499 336 C505 351 507 367 505 384 L461 386 C457 369 457 351 461 336Z" fill={C.cream} />
          <g clipPath={`url(#${id('shirt')})`} stroke={C.rosa} strokeWidth="3.2">
            <path d="M450 342 H512 M450 350 H512 M450 358 H512 M450 366 H512 M450 374 H512 M450 382 H512" />
          </g>
          <path d="M461 336 C469 329 491 329 499 336 C505 351 507 367 505 384 L461 386 C457 369 457 351 461 336Z" fill="none" />
          <path d="M467 354 L497 354 L502 386 L463 386Z" fill={C.dusty} />
          <path d="M469 354 L466 336 M495 354 L497 336" fill="none" stroke={C.dusty} strokeWidth="4" />
          <circle cx="470" cy="358" r="1.6" fill={C.cream} />
          <circle cx="494" cy="358" r="1.6" fill={C.cream} />
          {/* cuello y cabeza */}
          <path d="M472 322 L473 334 L485 334 L484 322Z" fill={C.skinB} stroke="none" />
          <circle cx="478" cy="306" r="22" fill={C.skinB} />
          <path d="M456 303 C453 284 465 273 480 273 C495 273 505 284 503 300 C503 312 501 321 497 327 C493 317 493 307 489 299 C481 296 470 296 462 300 C460 302 458 304 456 303Z" fill={C.hairB} />
          <path d="M462 300 q5 -6 10 -2 q4 -6 10 -1" fill="none" stroke={C.hairB} strokeWidth="2.5" />
          <ellipse cx="493" cy="310" rx="3.6" ry="5" fill={C.skinShade} />
          {/* broche de flor */}
          <g stroke="none">
            {[0, 72, 144, 216, 288].map((r) => (
              <ellipse key={r} cx="494" cy="282" rx="2" ry="3.4" fill={C.rosa} transform={`rotate(${r} 494 285)`} />
            ))}
            <circle cx="494" cy="285" r="1.6" fill={C.mustard} />
          </g>
          {/* rostro: contando algo con entusiasmo */}
          <ellipse cx="464" cy="309" rx="2" ry="2.6" fill="#4a3a32" stroke="none" />
          <ellipse cx="476" cy="309.5" rx="2.2" ry="2.8" fill="#4a3a32" stroke="none" />
          <circle cx="464.7" cy="308.2" r=".7" fill="#fff" stroke="none" />
          <circle cx="476.8" cy="308.6" r=".8" fill="#fff" stroke="none" />
          <path d="M461 302.5 q3 -2 6 0 M473 302.5 q3 -2 6 0" fill="none" stroke={C.hairB} strokeWidth="1.2" />
          <path d="M458 313 q-2.5 2 .5 3.5" fill="none" stroke="#c4927a" strokeWidth="1.1" />
          <path d="M461 319 q5 6 10 0Z" fill="#a0574f" strokeWidth="1" />
          <circle cx="473" cy="316" r="4" fill="#eaa79a" stroke="none" opacity=".45" />
          <circle cx="458" cy="316" r="2.6" fill="#eaa79a" stroke="none" opacity=".4" />
          {/* brazo delantero */}
          <path d="M465 344 C456 350 444 354 432 356" fill="none" stroke={C.skinB} strokeWidth="7" />
          <path d="M466 336 C472 340 472 348 464 350 C460 346 460 340 466 336Z" fill={C.cream} />

          {/* el dibujo que comparte */}
          <g transform="translate(-8 12) rotate(-10 446 334)">
            <rect x="424" y="314" width="46" height="38" rx="1" fill={C.paper} />
            <circle cx="436" cy="325" r="5" fill={C.mustard} stroke="none" />
            <path d="M436 317 v-2 M444 325 h2 M441 320 l2 -2 M431 320 l-2 -2" stroke={C.mustard} strokeWidth="1.4" />
            <circle cx="456" cy="334" r="6" fill="none" stroke={C.rosaDeep} strokeWidth="1.4" />
            <path d="M453.5 333 h.5 M458 333 h.5 M453 336 q3 2.5 6 0" stroke={C.ink} strokeWidth="1" />
            <path d="M456 340 V348 M450 344 H462" stroke={C.rosaDeep} strokeWidth="1.4" />
            <path d="M428 348 q4 -4 8 0 q4 -4 8 0" fill="none" stroke={C.salviaDeep} strokeWidth="1.4" />
          </g>
          {/* manos sujetando el papel */}
          <circle cx="430" cy="356" r="4.6" fill={C.skinB} />
          <circle cx="463" cy="341" r="4.4" fill={C.skinB} />
        </g>

        {/* ============ TARJETAS DE EMOCIONES Y CRAYONES ============ */}
        <g stroke={C.ink} strokeWidth=".8">
          <g transform="rotate(-14 384 424)">
            <rect x="372" y="410" width="24" height="30" rx="2.5" fill={C.paper} />
            <Face x={384} y={423} r={7} color={C.mustard} mood="feliz" />
          </g>
          <g transform="rotate(5 410 428)">
            <rect x="398" y="413" width="24" height="30" rx="2.5" fill={C.paper} />
            <Face x={410} y={426} r={7} color={C.dusty} mood="triste" />
          </g>
          <g transform="rotate(18 436 424)">
            <rect x="424" y="410" width="24" height="30" rx="2.5" fill={C.paper} />
            <Face x={436} y={423} r={7} color={C.rosa} mood="sorpresa" />
          </g>
          <g transform="rotate(-6 352 436)">
            <rect x="340" y="422" width="24" height="30" rx="2.5" fill={C.paper} />
            <Face x={352} y={435} r={7} color={C.salvia} mood="calma" />
          </g>
        </g>
        <g strokeLinecap="round" strokeWidth="4.5">
          <path d="M458 436 L476 430" stroke={C.rosaDeep} />
          <path d="M462 444 L481 441" stroke={C.salviaDeep} />
          <path d="M470 450 L486 452" stroke={C.mustard} />
        </g>

        {/* ============ BLOQUES Y COCHECITO DE MADERA ============ */}
        <g filter={`url(#${id('rough')})`} stroke={C.ink} strokeWidth=".9">
          <path d="M556 392 h22 v22 h-22Z" fill={C.mustard} />
          <path d="M556 392 l6 -5 h22 l-6 5Z" fill="#ecd39f" />
          <path d="M578 392 l6 -5 v22 l-6 5Z" fill="#c9a865" />
          <path d="M580 392 h22 v22 h-22Z" fill={C.salvia} />
          <path d="M580 392 l6 -5 h22 l-6 5Z" fill="#c1c6a6" />
          <path d="M602 392 l6 -5 v22 l-6 5Z" fill={C.salviaDeep} />
          <path d="M568 370 h22 v22 h-22Z" fill={C.rosa} />
          <path d="M568 370 l6 -5 h22 l-6 5Z" fill="#dcb6b0" />
          <path d="M590 370 l6 -5 v22 l-6 5Z" fill={C.rosaDeep} />
          <text x="567" y="408" textAnchor="middle" fontFamily="'Cormorant Garamond', Georgia, serif" fontWeight="700" fontSize="14" fill={C.ink} stroke="none">A</text>
          <text x="591" y="408" textAnchor="middle" fontFamily="'Cormorant Garamond', Georgia, serif" fontWeight="700" fontSize="14" fill={C.ink} stroke="none">B</text>
          <text x="579" y="386" textAnchor="middle" fontFamily="'Cormorant Garamond', Georgia, serif" fontWeight="700" fontSize="14" fill={C.ink} stroke="none">C</text>

          <path d="M622 432 C622 420 632 414 646 414 L660 414 C668 414 672 420 674 428 L680 430 C682 436 680 440 676 440 L624 440 C620 440 620 436 622 432Z" fill={C.wood} />
          <path d="M634 414 C636 406 642 404 652 404 C658 404 662 408 662 414Z" fill={C.dusty} />
          <circle cx="636" cy="442" r="7" fill={C.woodDeep} />
          <circle cx="666" cy="442" r="7" fill={C.woodDeep} />
          <circle cx="636" cy="442" r="2.4" fill={C.beige} />
          <circle cx="666" cy="442" r="2.4" fill={C.beige} />
        </g>

        {/* ============ HOJAS Y FLORES EN PRIMER PLANO ============ */}
        <g className="ambient ambient--sway" style={{ animationDuration: '8s', animationDelay: '-3s' }}>
          <path d="M770 478 C766 450 770 430 778 410" stroke={C.salviaDeep} strokeWidth="1.4" fill="none" />
          <path d="M772 448 C760 440 750 442 746 448 C756 454 766 452 772 448Z" fill={C.salvia} />
          <path d="M774 430 C784 420 792 422 794 428 C786 434 780 434 774 430Z" fill={C.salviaDeep} />
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse key={r} cx="778" cy="402" rx="3.4" ry="5.6" fill={C.rosa} transform={`rotate(${r} 778 408)`} />
          ))}
          <circle cx="778" cy="408" r="2.6" fill={C.mustard} />
        </g>

        {/* Textura de acuarela sobre toda la escena */}
        <rect width="800" height="480" filter={`url(#${id('wash')})`} opacity=".22" style={{ mixBlendMode: 'multiply' }} />
        <rect width="800" height="480" filter={`url(#${id('grain')})`} style={{ mixBlendMode: 'multiply' }} />
      </g>
    </svg>
  )
}
