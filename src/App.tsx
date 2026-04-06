import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
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
import PerDealer from './pages/PerDealer';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Admin from './pages/Admin/index';

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--cream)' }}>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
      <ChatWidget />
      <CookieBanner />
    </div>
  );
}

export default function App() {
  const { init } = useAuthStore();

  useEffect(() => {
    const unsub = init();
    return unsub;
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/auto" element={<PublicLayout><Cars /></PublicLayout>} />
        <Route path="/auto/:id" element={<PublicLayout><CarDetail /></PublicLayout>} />
        <Route path="/contatti" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/privacy" element={<PublicLayout><Privacy /></PublicLayout>} />
        <Route path="/garanzia" element={<PublicLayout><Garanzia /></PublicLayout>} />
        <Route path="/per-dealer" element={<PublicLayout><PerDealer /></PublicLayout>} />

        {/* Auth routes — no navbar */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/registrati" element={<Register />} />

        {/* Admin routes — own layout */}
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}