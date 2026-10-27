import { CreativeMotion } from '@/components/creative-motion'
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
import { SiteFooter } from '@/components/site-footer'
import { TeamSection } from '@/components/team-section'
import { PartnersSection } from '@/components/partners-section'
import { WelcomeSection } from '@/components/welcome-section'

export default function Page() {
  return (
    <div className="min-h-screen scroll-smooth bg-brand-ink">
      <SiteHeader />
      <CreativeMotion />
      <a href="#contenido" className="skip-link">Saltar al contenido</a>
      <main id="contenido" tabIndex={-1}>
        <HeroSection />
        <WelcomeSection />
        <AboutSection />
        <GallerySection />
        <PartnersSection kind="community" />
        <WinnersSection />
        <StagesSection />
        <BootcampSection />
        <RequirementsSection />
        <MatchmakingSection />
        <TeamSection />
        <FaqSection />
        <PartnersSection kind="sponsor" />
      </main>
      <SiteFooter />
    </div>
  )
}
