import Header from '../section/Header'
import ContactUsSection from '../section/ContactUsSection'
import SiteFooter from '../section/SiteFooter'

function ContactPage() {
  return (
    <div className="min-h-screen overflow-x-hidden overflow-y-hidden bg-grid text-slate-100">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-5 pb-16 pt-20 sm:px-8 sm:pt-24">
        <ContactUsSection />
      </main>

      <SiteFooter />
    </div>
  )
}

export default ContactPage
