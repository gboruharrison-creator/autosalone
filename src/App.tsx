import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import CookieBanner from './components/CookieBanner';
import ChatWidget from './components/ChatWidget';
import Home from './pages/Home';
import Cars from './pages/Cars';
import CarDetail from './pages/CarDetail';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Garanzia from './pages/Garanzia';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--cream)' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auto" element={<Cars />} />
            <Route path="/auto/:id" element={<CarDetail />} />
            <Route path="/contatti" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/garanzia" element={<Garanzia />} />
          </Routes>
        </main>
        <Footer />
        <ChatWidget />
        <CookieBanner />
      </div>
    </BrowserRouter>
  );
}
