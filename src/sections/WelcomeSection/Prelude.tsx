import { Reveal } from '../../components/Reveal/Reveal'
import { BotanicalSprig } from '../../components/DecorativeElements'
import { site } from '../../data/content'

/** Interludio con la frase principal, entre la bienvenida y el logro. */
export function Prelude() {
  return (
    <section
      id="preludio"
      aria-label="Frase de apertura"
      className="relative flex min-h-[70svh] items-center justify-center px-6 py-24 text-center"
    >
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <BotanicalSprig className="mx-auto h-24 w-10 rotate-90 opacity-80" />
        </Reveal>
        <Reveal delay={0.15}>
          <blockquote className="mt-6">
            <p className="font-display text-[1.85rem] font-medium italic leading-snug text-cafe sm:text-4xl md:text-[2.6rem]">
              “{site.mainPhrase}”
            </p>
          </blockquote>
        </Reveal>
      </div>
    </section>
  )
}
