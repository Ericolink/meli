import { ChapterSection } from '../../components/ChapterSection/ChapterSection'
import { PressedFlower, WildflowerSprig } from '../../components/DecorativeElements'
import { PhotoGallery } from '../../components/PhotoGallery/PhotoGallery'
import { memoriesIntro } from '../../data/content'
import { sortedMemories } from '../../data/memories'
import { StickerSlot } from '../../components/DecorativeSticker/StickerSlot'

export function MemoriesSection() {
  return (
    <ChapterSection
      id="recuerdos"
      title={memoriesIntro.title}
      intro={memoriesIntro.text}
      decoration={
        <>
          <WildflowerSprig className="pointer-events-none absolute right-0 top-20 w-12 rotate-[16deg] opacity-60 md:right-16 md:w-16" />
          <PressedFlower className="pointer-events-none absolute -left-4 bottom-16 w-16 rotate-[28deg] opacity-50 md:left-10 md:w-20" />
        </>
      }
    >
      <PhotoGallery items={sortedMemories} overlay={<StickerSlot section="recuerdos" slot="gallery" />} />
    </ChapterSection>
  )
}
