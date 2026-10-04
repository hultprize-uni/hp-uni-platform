import { SiteHeader } from '@/components/site-header'
import { HeroSection } from '@/components/hero-section'
import { AboutSection } from '@/components/about-section'
import { GallerySection } from '@/components/gallery-section'
import { WinnersSection } from '@/components/winners-section'
import { StagesSection } from '@/components/stages-section'
import { BootcampSection } from '@/components/bootcamp-section'
import { MatchmakingSection } from '@/components/matchmaking-section'
import { RequirementsSection } from '@/components/requirements-section'
import { FaqSection } from '@/components/faq-section'
import { ClosingCta } from '@/components/closing-cta'
import { ContactSection } from '@/components/contact-section'
import { SiteFooter } from '@/components/site-footer'

export default function Page() {
  return (
    <div className="min-h-screen scroll-smooth bg-brand-ink">
      <SiteHeader />
      <div className="h-20"></div>
      <main>
        <HeroSection />
        <AboutSection />
        <GallerySection />
        <WinnersSection />
        <StagesSection />
        <BootcampSection />
        <RequirementsSection />
        <MatchmakingSection />
        <FaqSection />
        <ClosingCta />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  )
}
