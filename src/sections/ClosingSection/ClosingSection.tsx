import { ArrowUp } from 'lucide-react'
import { BotanicalSprig, Ornament, PressedFlower, WaxSeal } from '../../components/DecorativeElements'
import { Reveal } from '../../components/Reveal/Reveal'
import { closing, site } from '../../data/content'
import { scrollToId } from '../../utils/scroll'
import { FallingPetals } from './FallingPetals'
import { StickerSlot } from '../../components/DecorativeSticker/StickerSlot'

export function ClosingSection() {
  return (
    <section
      id="final"
      aria-labelledby="final-titulo"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 pb-14 pt-24 text-center"
    >
      <FallingPetals />
      <StickerSlot section="final" />

      <div className="relative mx-auto max-w-xl">
        <StickerSlot section="final" slot="message" />
        <Reveal>
          <div className="mx-auto flex items-end justify-center gap-1">
            <BotanicalSprig className="h-20 w-8 -rotate-[24deg] opacity-80" />
            <PressedFlower className="h-24 w-14" />
            <BotanicalSprig className="h-20 w-8 rotate-[24deg] opacity-80" />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 id="final-titulo" className="mt-8 text-[2.4rem] italic leading-tight sm:text-6xl">
            {closing.title}
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-md text-[1.0625rem] text-cafe/95 sm:text-lg">{closing.text}</p>
        </Reveal>

        <Reveal delay={0.3}>
          <Ornament className="mx-auto mt-10 w-44" />
          <p className="mt-6 font-display text-[clamp(2.1rem,10vw,3.75rem)] font-semibold leading-none text-vino">
            {closing.highlight}
          </p>
        </Reveal>

        <Reveal delay={0.45}>
          <div className="mt-12 flex flex-col items-center">
            <WaxSeal className="w-14 drop-shadow-[0_2px_2px_rgb(60_30_30/0.3)]" />
            <p className="mt-4 font-hand text-[1.7rem] leading-tight text-cafe">{closing.signature}</p>
            <p className="mt-1 font-hand text-[2.1rem] leading-none text-vino">— {site.author}</p>
            <p className="mt-1 font-display text-lg tracking-[0.3em] text-tinta-oscura">{site.year}</p>
          </div>
        </Reveal>

        <Reveal delay={0.55}>
          <button type="button" className="btn-quiet mt-12" onClick={() => scrollToId('bienvenida')}>
            <ArrowUp className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
            {closing.backToTop}
          </button>
        </Reveal>
      </div>
    </section>
  )
}
