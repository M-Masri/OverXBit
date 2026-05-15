import Header from './section/Header'
import HeroSection from './section/HeroSection'
import CryptoTickerStrip from './section/CryptoTickerStrip'
import ChairmanSection from './section/ChairmanSection'
import OurServicesSection from './section/OurServicesSection'
import OverxbitFiguresSection from './section/OverxbitFiguresSection'
import WhyChooseSection from './section/WhyChooseSection'
import TradingJourneySection from './section/TradingJourneySection'
import FaqSection from './section/FaqSection'
import ContactUsSection from './section/ContactUsSection'
import SiteFooter from './section/SiteFooter'
import LoginPage from './pages/LoginPage'
import ClientPortalPage from './pages/ClientPortalPage'
import ServicePage from './pages/ServicePage'
import FaqPage from './pages/FaqPage'
import ContactPage from './pages/ContactPage'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearSession, selectIsAuthenticated, selectSessionReady, selectToken, setSessionReady, setUser } from './services/authSlice'
import { useGetMeQuery } from './services/overxApi'
import { clearStoredToken } from './services/sessionStorage'

function HomePage() {
  return (
    <div className="min-h-screen overflow-y-hidden overflow-x-hidden bg-grid text-slate-100">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-5 pb-16 pt-0 sm:px-8">
        <HeroSection />
        <CryptoTickerStrip />
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

function AuthSessionSync() {
  const dispatch = useDispatch()
  const token = useSelector(selectToken)
  const sessionReady = useSelector(selectSessionReady)
  const { data, error, isLoading, isFetching } = useGetMeQuery(undefined, {
    skip: !token || sessionReady,
  })

  useEffect(() => {
    if (!token) {
      dispatch(setSessionReady(true))
    }
  }, [dispatch, token])

  useEffect(() => {
    if (!token || sessionReady) {
      return
    }

    if (data?.data) {
      dispatch(setUser(data.data))
    }
  }, [data, dispatch, sessionReady, token])

  useEffect(() => {
    if (!token || sessionReady || !error) {
      return
    }

    clearStoredToken()
    dispatch(clearSession())
  }, [dispatch, error, sessionReady, token])

  useEffect(() => {
    if (!token || sessionReady) {
      return
    }

    if (!isLoading && !isFetching && !data && !error) {
      dispatch(setSessionReady(true))
    }
  }, [data, dispatch, error, isFetching, isLoading, sessionReady, token])

  return null
}

function ProtectedRoute({ children }) {
  const sessionReady = useSelector(selectSessionReady)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  if (!sessionReady) {
    return (
      <div className="bg-grid flex min-h-screen items-center justify-center px-6 text-slate-100">
        <div className="portal-loader" style={{ borderTopColor: '#3B82F6' }} />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  return (
    <>
      <AuthSessionSync />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/services/:slug" element={<ServicePage />} />
        <Route path="/portal/*" element={<ProtectedRoute><ClientPortalPage /></ProtectedRoute>} />
      </Routes>
    </>
  )
}

export default App
