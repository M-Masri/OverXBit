import Header from '../section/Header'
import FaqSection from '../section/FaqSection'
import SiteFooter from '../section/SiteFooter'

function FaqPage() {
  return (
    <div className="min-h-screen overflow-x-hidden overflow-y-hidden bg-grid text-slate-100">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-5 pb-16 pt-20 sm:px-8 sm:pt-24">
        <FaqSection />
      </main>

      <SiteFooter />
    </div>
  )
}

export default FaqPage
