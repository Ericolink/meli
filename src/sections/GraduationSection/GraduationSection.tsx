import { ChapterSection } from '../../components/ChapterSection/ChapterSection'
import { FernSprig } from '../../components/DecorativeElements'
import { Reveal } from '../../components/Reveal/Reveal'
import { graduation, site } from '../../data/content'
import { Diploma } from './Diploma'

export function GraduationSection() {
  return (
    <ChapterSection
      id="logro"
      numeral="II"
      label="El logro"
      title={graduation.title}
      subtitle={graduation.subtitle}
      decoration={
        <FernSprig className="pointer-events-none absolute -left-6 top-28 w-16 -rotate-12 opacity-50 md:left-8 md:w-24" />
      }
    >
      <div className="mt-16 grid items-center gap-16 md:mt-20 md:grid-cols-[1fr_1.05fr] md:gap-14">
        <Reveal offset={30} amount={0.3}>
          <Diploma name={site.name} degree={graduation.subtitle} photo={graduation.photo} />
        </Reveal>

        <div className="mx-auto max-w-md space-y-5 text-[1.0625rem] sm:text-lg md:mx-0">
          {graduation.paragraphs.map((p, i) => (
            <Reveal key={i} delay={i * 0.08} offset={14}>
              <p
                className={
                  i === 2
                    ? 'font-display text-[1.75rem] font-medium italic leading-snug text-vino'
                    : 'text-cafe/95'
                }
              >
                {p}
              </p>
            </Reveal>
          ))}
          <Reveal delay={0.1} offset={14}>
            <p className="pt-3 font-display text-[1.75rem] font-semibold leading-snug text-cafe sm:text-3xl">
              {graduation.closing}
            </p>
          </Reveal>
        </div>
      </div>
    </ChapterSection>
  )
}
