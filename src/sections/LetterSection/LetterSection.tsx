import { ChapterSection } from '../../components/ChapterSection/ChapterSection'
import { FinalLetter } from '../../components/FinalLetter/FinalLetter'
import { letter, site } from '../../data/content'

export function LetterSection() {
  return (
    <ChapterSection id="carta" numeral="VI" label="La carta final" title={letter.title}>
      <FinalLetter
        greeting={letter.greeting}
        paragraphs={letter.paragraphs}
        signature={letter.signature}
        year={site.year}
      />
    </ChapterSection>
  )
}
