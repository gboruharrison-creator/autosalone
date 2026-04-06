import { Link } from 'react-router-dom';
import { dealer } from '../data/dealer';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--black)', color: 'white', padding: '72px 2rem 32px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* Top */}
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '60px', marginBottom: '64px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '28px', height: '28px', backgroundColor: 'var(--red)', clipPath: 'polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%)' }} />
              <span className="serif" style={{ color: 'white', fontSize: '1.1rem' }}>
                Auto<span style={{ color: 'var(--red)' }}>Salone</span>
              </span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', lineHeight: 1.8, marginBottom: '24px', fontWeight: 300, maxWidth: '280px' }}>
              {dealer.tagline}.<br />
              {dealer.address}, {dealer.city}.
            </p>
            <a href={`https://wa.me/${dealer.whatsapp}`} target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                backgroundColor: 'var(--red)', color: 'white', textDecoration: 'none',
                padding: '10px 20px', fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.04em',
              }}>
              WhatsApp
            </a>
          </div>

          {[
            {
              title: 'Veicoli',
              links: [
                { label: 'Auto Nuove', to: '/auto?condizione=new' },
                { label: 'Auto Usate', to: '/auto?condizione=used' },
                { label: 'Tutti i Veicoli', to: '/auto' },
              ]
            },
            {
              title: 'Concessionaria',
              links: [
                { label: 'Chi Siamo', to: '/' },
                { label: 'Finanziamento', to: '/' },
                { label: 'Garanzia', to: '/' },
                { label: 'Contatti', to: '/contatti' },
              ]
            },
            {
              title: 'Informazioni',
              links: [
                { label: 'Privacy Policy', to: '/privacy' },
                { label: 'Cookie Policy', to: '/privacy' },
                { label: 'Garanzia Legale', to: '/garanzia' },
              ]
            },
          ].map(col => (
            <div key={col.title}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '20px' }}>{col.title}</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {col.links.map(l => (
                  <li key={l.label}>
                    <Link to={l.to} style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 300, transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'white'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Hours strip */}
        <div style={{
          display: 'flex', gap: '32px', flexWrap: 'wrap',
          padding: '24px 0',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          marginBottom: '24px',
        }}>
          {dealer.hours.map(h => (
            <div key={h.days} style={{ display: 'flex', gap: '12px' }}>
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.78rem' }}>{h.days}</span>
              <span style={{ color: h.time === 'Chiuso' ? 'var(--red)' : 'rgba(255,255,255,0.6)', fontSize: '0.78rem', fontWeight: 500 }}>{h.time}</span>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>
            © {new Date().getFullYear()} {dealer.name} · P.IVA 01234567890
          </p>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>
            {dealer.address}, {dealer.city} ({dealer.province}) · {dealer.phone}
          </p>
        </div>
      </div>
    </footer>
  );
}