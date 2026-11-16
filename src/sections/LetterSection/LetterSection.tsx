import { ChapterSection } from '../../components/ChapterSection/ChapterSection'
import { FinalLetter } from '../../components/FinalLetter/FinalLetter'
import { letter, site } from '../../data/content'
import { StickerSlot } from '../../components/DecorativeSticker/StickerSlot'

export function LetterSection() {
  return (
    <ChapterSection id="carta" numeral="VI" label="La carta final" title={letter.title}>
      <FinalLetter
        greeting={letter.greeting}
        paragraphs={letter.paragraphs}
        signature={letter.signature}
        author={site.author}
        letterOverlay={<StickerSlot section="carta" slot="letter" />}
        signatureOverlay={<StickerSlot section="carta" slot="signature" />}
        year={site.year}
      />
    </ChapterSection>
  )
}
