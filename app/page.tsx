import { SiteHeader } from '@/components/site-header'
import { HeroSection } from '@/components/hero-section'
import { AboutSection } from '@/components/about-section'
import { StagesSection } from '@/components/stages-section'
import { MatchmakingSection } from '@/components/matchmaking-section'
import { RequirementsSection } from '@/components/requirements-section'
import { PortalSection } from '@/components/portal-section'
import { FaqSection } from '@/components/faq-section'
import { SiteFooter } from '@/components/site-footer'

export default function Page() {
  return (
    <div className="min-h-screen bg-brand-ink">
      <SiteHeader />
      <main>
        <HeroSection />
        <AboutSection />
        <StagesSection />
        <MatchmakingSection />
        <RequirementsSection />
        <PortalSection />
        <FaqSection />
      </main>
      <SiteFooter />
    </div>
  )
}
