import { ChapterSection } from '../../components/ChapterSection/ChapterSection'
import { BotanicalSprig, Tape } from '../../components/DecorativeElements'
import { Reveal } from '../../components/Reveal/Reveal'
import { future } from '../../data/content'
import { ListeningScene } from './ListeningScene'

export function FutureSection() {
  return (
    <ChapterSection id="mundo" numeral="V" label="Un mundo por descubrir" title={future.title}>
      <Reveal offset={30} amount={0.25}>
        <figure className="relative mx-auto mt-14 max-w-4xl md:mt-16">
          <div className="paper-sheet relative rotate-[-0.6deg] p-2 sm:p-3">
            <Tape className="-left-3 -top-2 rotate-[-32deg]" />
            <Tape className="-right-3 -top-2 rotate-[30deg]" variant="rosa" />
            {/* En móvil se encuadra la escena central (4:3); en pantallas grandes, completa (5:3) */}
            <div className="aspect-[4/3] overflow-hidden rounded-[2px] sm:aspect-[5/3]">
              <ListeningScene />
            </div>
          </div>
          <BotanicalSprig className="pointer-events-none absolute -bottom-10 -right-2 h-24 w-10 rotate-[32deg] opacity-80 sm:-right-6" />
          <figcaption className="mt-5 text-center font-hand text-[1.45rem] leading-tight text-tinta-oscura sm:text-2xl">
            {future.illustrationCaption}
          </figcaption>
        </figure>
      </Reveal>

      <div className="mx-auto mt-12 max-w-xl space-y-5 text-[1.0625rem] sm:text-lg md:mt-14">
        {future.paragraphs.map((p, i) => (
          <Reveal key={i} delay={i * 0.06} offset={14}>
            <p className="text-cafe/95">{p}</p>
          </Reveal>
        ))}
        <Reveal delay={0.08} offset={14}>
          <p className="border-l-2 border-rosa/50 pl-5 font-display text-[1.6rem] font-medium italic leading-snug text-vino sm:text-[1.8rem]">
            {future.closing}
          </p>
        </Reveal>
      </div>
    </ChapterSection>
  )
}
