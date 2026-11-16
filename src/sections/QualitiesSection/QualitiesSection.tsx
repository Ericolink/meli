import { ChapterSection } from '../../components/ChapterSection/ChapterSection'
import { FernSprig } from '../../components/DecorativeElements'
import { MemoryCard } from '../../components/MemoryCard/MemoryCard'
import { Reveal } from '../../components/Reveal/Reveal'
import { qualities } from '../../data/content'

export function QualitiesSection() {
  return (
    <ChapterSection
      id="admiro"
      numeral="IV"
      label="Lo que admiro de ti"
      title={qualities.title}
      intro={qualities.text}
      decoration={
        <FernSprig className="pointer-events-none absolute -right-4 top-24 w-16 rotate-[160deg] opacity-45 md:right-12 md:w-24" />
      }
    >
      <ul className="mx-auto mt-14 grid max-w-sm gap-7 sm:max-w-2xl sm:grid-cols-2 lg:max-w-none lg:grid-cols-4 lg:gap-6">
        {qualities.cards.map((c, i) => (
          <li key={c.id}>
            <Reveal delay={i * 0.1} offset={24}>
              <MemoryCard
                icon={c.icon}
                title={c.title}
                description={c.description}
                hint={qualities.hint}
                index={i}
              />
            </Reveal>
          </li>
        ))}
      </ul>
    </ChapterSection>
  )
}
