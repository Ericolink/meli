import type { ChapterId } from '../../data/content'
import { assetFor, decorationsFor } from '../../data/decorations'
import type { DecorationSlot } from '../../types/decorations'
import { DecorativeSticker } from './DecorativeSticker'

interface StickerSlotProps {
  section: ChapterId
  slot?: DecorationSlot
}

/**
 * Renderiza las decoraciones configuradas en src/data/decorations.ts para
 * una sección y zona. El contenedor padre debe tener position: relative.
 */
export function StickerSlot({ section, slot = 'section' }: StickerSlotProps) {
  const items = decorationsFor(section, slot)
  if (items.length === 0) return null
  return (
    <>
      {items.map((d, i) => {
        const asset = assetFor(d.src)
        return (
          <DecorativeSticker
            key={d.id}
            id={d.id}
            src={d.src}
            alt={d.alt}
            rotation={d.rotation}
            tier={d.tier}
            size={d.size}
            mobileSize={d.mobileSize}
            opacity={d.opacity}
            position={d.position}
            mobile={d.mobile}
            animation={d.animation}
            enter={d.enter}
            duration={d.duration}
            delay={d.delay}
            layer={d.layer}
            variant={asset?.kind ?? 'cutout'}
            width={asset?.width}
            height={asset?.height}
            section={section}
            zIndex={d.layer === 'background' ? 0 : 3 + (d.order ?? i)}
          />
        )
      })}
    </>
  )
}
