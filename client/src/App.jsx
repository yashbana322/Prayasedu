import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import MainLayout from './layouts/MainLayout'
import ScrollToTop from './components/ScrollToTop'
import CustomCursor from './components/CustomCursor/CustomCursor'
import FluidBackground from './components/FluidBackground/FluidBackground'

/* Code-split all pages */
const Home       = lazy(() => import('./pages/Home/Home'))
const About      = lazy(() => import('./pages/About/About'))
const MeetUs     = lazy(() => import('./pages/MeetUs/MeetUs'))
const Admissions = lazy(() => import('./pages/Admissions/Admissions'))
const Donate     = lazy(() => import('./pages/Donate/Donate'))
const Gallery    = lazy(() => import('./pages/Gallery/Gallery'))
const Contact    = lazy(() => import('./pages/Contact/Contact'))

function PageLoader() {
  return (
    <div className="page-loader" role="status" aria-label="Loading page">
      <div className="page-loader__spinner">
        <div className="page-loader__ring" />
        <span className="page-loader__text">Prayas</span>
      </div>
    </div>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <>
      <FluidBackground />
      <CustomCursor />
      <ScrollToTop />

      <MainLayout>
        <AnimatePresence mode="wait" initial={false}>
          <Suspense fallback={<PageLoader />} key={location.pathname}>
            <Routes location={location}>
              <Route path="/"           element={<Home />}       />
              <Route path="/about"      element={<About />}      />
              <Route path="/meet-us"    element={<MeetUs />}     />
              <Route path="/admissions" element={<Admissions />} />
              <Route path="/donate"     element={<Donate />}     />
              <Route path="/gallery"    element={<Gallery />}    />
              <Route path="/reach-out"  element={<Contact />}    />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </MainLayout>
    </>
  )
}
