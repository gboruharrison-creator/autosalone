import { useEffect, useState } from 'react';
import { Link, useNavigate, Routes, Route } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import AdminDashboard from './Dashboard';
import AdminCars from './Cars';
import AdminCarForm from './CarForm';
import AdminLeads from './Leads';
import AdminSettings from './Settings';
import toast from 'react-hot-toast';

const NAVY = 'var(--black)';
const RED = 'var(--red)';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: '▣', exact: true },
  { to: '/admin/auto', label: 'Veicoli', icon: '🚗', exact: false },
  { to: '/admin/leads', label: 'Lead', icon: '👤', exact: false },
  { to: '/admin/impostazioni', label: 'Impostazioni', icon: '⚙', exact: false },
];

export default function Admin() {
  const { user, dealer, loading, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate('/admin/login');
  }, [user, loading]);

  if (loading) return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '36px', height: '36px', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--red)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    toast.success('Disconnesso');
    navigate('/');
  };

  const sidebarWidth = '220px';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F5F3EF', fontFamily: 'DM Sans, sans-serif' }}>

      {/* Sidebar */}
      <aside style={{
        width: sidebarWidth, backgroundColor: 'var(--black)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
        transition: 'transform 0.3s',
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '26px', height: '26px', backgroundColor: RED, clipPath: 'polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%)' }} />
            <span className="serif" style={{ color: 'white', fontSize: '1rem' }}>
              Auto<span style={{ color: RED }}>Salone</span>
            </span>
          </Link>
          {dealer && (
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', marginTop: '8px', letterSpacing: '0.04em' }}>
              {dealer.name}
            </p>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {navItems.map(item => {
            const active = item.exact
              ? window.location.pathname === item.to
              : window.location.pathname.startsWith(item.to) && item.to !== '/admin';
            return (
              <Link key={item.to} to={item.to} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 12px',
                backgroundColor: active ? 'rgba(200,16,46,0.15)' : 'transparent',
                color: active ? 'white' : 'rgba(255,255,255,0.45)',
                textDecoration: 'none', fontSize: '0.845rem',
                fontWeight: active ? 500 : 400,
                borderLeft: `2px solid ${active ? RED : 'transparent'}`,
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'white'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
              >
                <span style={{ fontSize: '0.9rem', width: '18px', textAlign: 'center' }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Plan badge + logout */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', padding: '10px 12px', marginBottom: '10px' }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '3px' }}>Piano attivo</p>
            <p style={{ color: 'white', fontSize: '0.82rem', fontWeight: 500, textTransform: 'capitalize' }}>{dealer?.plan || 'Starter'}</p>
          </div>
          <button onClick={handleLogout} style={{
            width: '100%', backgroundColor: 'transparent',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.4)', padding: '9px 12px',
            fontSize: '0.78rem', cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif', textAlign: 'left',
            transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
          >
            ↩ Esci
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: sidebarWidth, flex: 1, minHeight: '100vh' }}>
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="auto" element={<AdminCars />} />
          <Route path="auto/nuovo" element={<AdminCarForm />} />
          <Route path="auto/:id/modifica" element={<AdminCarForm />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="impostazioni" element={<AdminSettings />} />
        </Routes>
      </main>
    </div>
  );
}