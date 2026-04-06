import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { dealer } from '../data/dealer';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const solid = scrolled || !isHome;

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        backgroundColor: solid ? 'rgba(245,243,239,0.97)' : 'transparent',
        backdropFilter: solid ? 'blur(16px)' : 'none',
        borderBottom: solid ? '1px solid var(--warm-gray)' : 'none',
        transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          padding: '0 2rem', height: '68px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px', height: '32px',
              backgroundColor: 'var(--red)',
              clipPath: 'polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }} />
            <div>
              <span className="serif" style={{
                color: solid ? 'var(--black)' : 'white',
                fontSize: '1.15rem', letterSpacing: '-0.01em',
                fontWeight: 400,
              }}>
                Auto<span style={{ color: 'var(--red)' }}>Salone</span>
              </span>
              <div style={{
                color: solid ? 'var(--mid-gray)' : 'rgba(255,255,255,0.6)',
                fontSize: '0.58rem', letterSpacing: '0.18em',
                textTransform: 'uppercase', marginTop: '-1px',
              }}>
                {dealer.city} · Est. {dealer.founded}
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {[
              { label: 'Nuove', to: '/auto?condizione=new' },
              { label: 'Usate', to: '/auto?condizione=used' },
              { label: 'Tutti i Veicoli', to: '/auto' },
              { label: 'Contatti', to: '/contatti' },
            ].map(link => (
              <Link key={link.to} to={link.to} style={{
                color: solid ? 'var(--text)' : 'rgba(255,255,255,0.85)',
                textDecoration: 'none', fontSize: '0.875rem',
                fontWeight: 400, padding: '7px 16px',
                borderRadius: '6px', letterSpacing: '0.01em',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = solid ? 'var(--warm-gray)' : 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = solid ? 'var(--black)' : 'white'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = solid ? 'var(--text)' : 'rgba(255,255,255,0.85)'; }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <a href={`tel:${dealer.phone}`}
              style={{
                color: solid ? 'var(--text)' : 'rgba(255,255,255,0.85)',
                textDecoration: 'none', fontSize: '0.82rem',
                fontWeight: 500, letterSpacing: '0.01em',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.1a16 16 0 006 6l.56-.56a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
              <span className="desktop-only">{dealer.phone}</span>
            </a>

            <a href={`https://wa.me/${dealer.whatsapp}?text=Ciao!`}
              target="_blank" rel="noopener noreferrer"
              style={{
                backgroundColor: 'var(--red)', color: 'white',
                textDecoration: 'none', padding: '8px 18px',
                borderRadius: '6px', fontSize: '0.82rem',
                fontWeight: 500, letterSpacing: '0.02em',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--red-dark)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--red)'}
            >
              WhatsApp
            </a>

            {/* Hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '6px', display: 'flex', flexDirection: 'column',
                gap: '4px',
              }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  display: 'block', height: '1.5px', borderRadius: '2px',
                  backgroundColor: solid ? 'var(--black)' : 'white',
                  transition: 'all 0.3s',
                  width: i === 1 ? '16px' : '22px',
                  transform: menuOpen
                    ? i === 0 ? 'rotate(45deg) translateY(8px)'
                    : i === 2 ? 'rotate(-45deg) translateY(-8px)' : 'scaleX(0)'
                    : 'none',
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }} />
              ))}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99,
        backgroundColor: 'var(--black)',
        opacity: menuOpen ? 1 : 0,
        pointerEvents: menuOpen ? 'all' : 'none',
        transition: 'opacity 0.35s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '2rem',
      }}>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { label: 'Auto Nuove', to: '/auto?condizione=new' },
            { label: 'Auto Usate', to: '/auto?condizione=used' },
            { label: 'Tutti i Veicoli', to: '/auto' },
            { label: 'Contatti', to: '/contatti' },
          ].map((link, i) => (
            <Link key={link.to} to={link.to} style={{
              color: 'white', textDecoration: 'none',
              fontSize: 'clamp(2rem, 6vw, 3.5rem)',
              fontFamily: 'DM Serif Display, serif',
              fontWeight: 400, lineHeight: 1.2,
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateX(0)' : 'translateX(-20px)',
              transition: `all 0.4s cubic-bezier(0.4,0,0.2,1) ${i * 0.06}s`,
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              paddingBottom: '16px',
            }}>
              {link.label}
            </Link>
          ))}
        </nav>
        <a href={`https://wa.me/${dealer.whatsapp}`} target="_blank" rel="noopener noreferrer"
          style={{
            marginTop: '40px', backgroundColor: 'var(--red)', color: 'white',
            textDecoration: 'none', padding: '16px 24px', borderRadius: '8px',
            fontWeight: 500, textAlign: 'center', fontSize: '1rem',
          }}>
          Contattaci su WhatsApp
        </a>
        <p style={{ color: 'rgba(255,255,255,0.3)', marginTop: '24px', fontSize: '0.8rem' }}>
          {dealer.address}, {dealer.city} · {dealer.phone}
        </p>
      </div>

      <style>{`
        @media(max-width: 768px) { .desktop-only { display: none !important; } }
      `}</style>
    </>
  );
}