import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { SocialProofBar } from "@/components/landing/social-proof-bar"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { AlgorithmSection } from "@/components/landing/algorithm-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100svh", background: "var(--background)" }}>
      <Navbar />
      <main>
        <HeroSection />
        <SocialProofBar />
        <HowItWorksSection />
        <FeaturesSection />
        <AlgorithmSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
