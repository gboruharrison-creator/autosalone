import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('autosalone-cookies');
    if (!accepted) setTimeout(() => setShow(true), 1500);
  }, []);

  const accept = () => {
    localStorage.setItem('autosalone-cookies', '1');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 2000,
      backgroundColor: 'var(--black)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      padding: '20px 2rem',
    }}>
      <div style={{
        maxWidth: '1280px', margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '24px', flexWrap: 'wrap',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', lineHeight: 1.6, fontWeight: 300, flex: 1 }}>
          Utilizziamo cookie tecnici essenziali per il funzionamento del sito.{' '}
          <Link to="/privacy" style={{ color: 'white', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)' }}>
            Privacy Policy
          </Link>
        </p>
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          <button onClick={accept} style={{
            backgroundColor: 'var(--red)', color: 'white', border: 'none',
            padding: '10px 24px', fontSize: '0.75rem', fontWeight: 500,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
            transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--red-dark)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--red)'}
          >
            Accetta
          </button>
        </div>
      </div>
    </div>
  );
}