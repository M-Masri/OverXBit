import Header from './section/Header'
import HeroSection from './section/HeroSection'
import ChairmanSection from './section/ChairmanSection'
import OurServicesSection from './section/OurServicesSection'
import OverxbitFiguresSection from './section/OverxbitFiguresSection'
import WhyChooseSection from './section/WhyChooseSection'
import TradingJourneySection from './section/TradingJourneySection'
import FaqSection from './section/FaqSection'
import ContactUsSection from './section/ContactUsSection'
import SiteFooter from './section/SiteFooter'
import LoginPage from './pages/LoginPage'

function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-grid text-slate-100">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-5 pb-16 pt-0 sm:px-8">
        <HeroSection />
        <ChairmanSection />
        <OurServicesSection />
        <OverxbitFiguresSection />
        <WhyChooseSection />
        <TradingJourneySection />
        <FaqSection />
        <ContactUsSection />
      </main>

      <SiteFooter />
    </div>
  )
}

function App() {
  const currentPath = window.location.pathname.toLowerCase()

  if (currentPath === '/login') {
    return <LoginPage />
  }

  return (
    <HomePage />
  )
}

export default App
