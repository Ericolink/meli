import { MotionConfig } from 'motion/react'
import { MusicPlayer } from './components/MusicPlayer/MusicPlayer'
import { ProgressIndicator } from './components/ProgressIndicator/ProgressIndicator'
import { AudioProvider } from './context/AudioProvider'
import { chapters, music } from './data/content'
import { ClosingSection } from './sections/ClosingSection/ClosingSection'
import { FutureSection } from './sections/FutureSection/FutureSection'
import { GraduationSection } from './sections/GraduationSection/GraduationSection'
import { LetterSection } from './sections/LetterSection/LetterSection'
import { MemoriesSection } from './sections/MemoriesSection/MemoriesSection'
import { QualitiesSection } from './sections/QualitiesSection/QualitiesSection'
import { Prelude } from './sections/WelcomeSection/Prelude'
import { WelcomeSection } from './sections/WelcomeSection/WelcomeSection'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AudioProvider src={music.src} defaultVolume={music.volume} fadeInMs={music.fadeInMs}>
        <ProgressIndicator chapters={chapters} />
        <main>
          <WelcomeSection nextId="preludio" />
          <Prelude />
          <GraduationSection />
          <MemoriesSection />
          <QualitiesSection />
          <FutureSection />
          <LetterSection />
          <ClosingSection />
        </main>
        <MusicPlayer label={music.label} />
      </AudioProvider>
    </MotionConfig>
  )
}
