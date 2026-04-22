import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'
import '../App.css'

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 'var(--nav-height)', flex: 1 }}>
        {children}
      </div>
      <Footer />
    </>
  )
}
