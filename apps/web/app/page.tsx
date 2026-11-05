import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { ResearchTimeline } from "@/components/landing/research-timeline"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { AlgorithmSection } from "@/components/landing/algorithm-section"
import { BuilderNoteSection } from "@/components/landing/builder-note-section"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100svh", background: "var(--background)" }}>
      <Navbar />
      <main>
        <HeroSection />
        <ResearchTimeline />
        <HowItWorksSection />
        <FeaturesSection />
        <AlgorithmSection />
        <BuilderNoteSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
