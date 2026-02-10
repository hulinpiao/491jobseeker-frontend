import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { HeroSection } from '../components/landing/HeroSection'
import { HowItWorks } from '../components/landing/HowItWorks'
import { WhyChooseUs } from '../components/landing/WhyChooseUs'

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <HowItWorks />
        <WhyChooseUs />
      </main>
      <Footer />
    </div>
  )
}
