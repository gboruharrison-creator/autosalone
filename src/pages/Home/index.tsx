import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { cars, getFeatured } from '../../data/cars';
import { dealer } from '../../data/dealer';
import CarCard from '../../components/CarCard';

const newCount = cars.filter(c => c.condition === 'new').length;
const usedCount = cars.filter(c => c.condition === 'used').length;

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const featured = getFeatured();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(search.trim() ? `/auto?q=${encodeURIComponent(search)}` : '/auto');
  };

  return (
    <>
      <Helmet>
        <title>{dealer.name} — Auto Nuove e Usate a {dealer.city}</title>
        <meta name="description" content={`${dealer.name} a ${dealer.city}. ${newCount} auto nuove e ${usedCount} usate. Garanzia e finanziamento.`} />
      </Helmet>

      {/* ── HERO ── */}
      <section className="hero-grid" style={{
        minHeight: '100vh',
        backgroundColor: 'var(--black)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Left — Text */}
        <div className="hero-text" style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: '140px 3rem 80px',
          position: 'relative', zIndex: 2,
        }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p style={{
              color: 'var(--red)', fontSize: '0.7rem', fontWeight: 500,
              letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '24px',
            }}>
              {dealer.city} · Dal {dealer.founded}
            </p>
            <h1 className="serif" style={{
              fontSize: 'clamp(3rem, 5.5vw, 5.5rem)',
              fontWeight: 400, color: 'white', lineHeight: 1.05,
              marginBottom: '28px', letterSpacing: '-0.02em',
            }}>
              Il tuo<br />
              <em style={{ color: 'var(--red)' }}>showroom</em><br />
              di fiducia
            </h1>
            <p style={{
              color: 'rgba(255,255,255,0.5)', fontSize: '1rem',
              lineHeight: 1.75, maxWidth: '380px', marginBottom: '40px',
              fontWeight: 300,
            }}>
              {newCount} auto nuove, {usedCount} usate selezionate.
              Garanzia legale, finanziamento su misura,
              consegna in tutta Italia.
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0', maxWidth: '420px', marginBottom: '32px' }}>
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Cerca marca o modello..."
                style={{
                  flex: 1, padding: '14px 20px',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRight: 'none',
                  color: 'white', fontSize: '0.875rem',
                  outline: 'none', fontFamily: 'DM Sans, sans-serif',
                  borderRadius: '4px 0 0 4px',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.3)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
              <button type="submit" style={{
                padding: '14px 20px', backgroundColor: 'var(--red)',
                border: 'none', color: 'white', cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
                fontSize: '0.875rem', borderRadius: '0 4px 4px 0',
                transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--red-dark)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--red)'}
              >
                Cerca
              </button>
            </form>

            {/* CTA links */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link to="/auto?condizione=new" style={{
                color: 'white', textDecoration: 'none', fontSize: '0.82rem',
                fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', gap: '8px',
                borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '2px',
                transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'white'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
              >
                Auto Nuove ({newCount})
              </Link>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
              <Link to="/auto?condizione=used" style={{
                color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.82rem',
                fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', gap: '8px',
                borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2px',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              >
                Auto Usate ({usedCount})
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right — Photo */}
        <motion.div
          className="hero-photo"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=900&fit=crop&q=85"
            alt="Auto premium"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
          />
          {/* Gradient overlay left */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, var(--black) 0%, transparent 40%)',
          }} />
        </motion.div>

        {/* Stats bar */}
        <motion.div
          className="hero-stats"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            zIndex: 3,
          }}
        >
          {[
            { num: `${dealer.carsSold.toLocaleString('it')}+`, label: 'Auto vendute' },
            { num: `${new Date().getFullYear() - dealer.founded}`, label: 'Anni di esperienza' },
            { num: `${dealer.rating}`, label: 'Valutazione media' },
            { num: `${dealer.reviews}+`, label: 'Recensioni clienti' },
          ].map(s => (
            <div key={s.label} style={{
              padding: '24px',
              borderRight: '1px solid rgba(255,255,255,0.06)',
            }}>
              <p className="serif" style={{ color: 'white', fontSize: '1.8rem', fontWeight: 400, lineHeight: 1 }}>{s.num}</p>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', marginTop: '6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Mobile overlay */}
        <style>{`
          @media (max-width: 768px) {
            section:first-of-type { grid-template-columns: 1fr !important; }
            section:first-of-type > div:last-of-type:not([style*="absolute"]) { display: none; }
          }
        `}</style>
      </section>

      {/* ── FEATURED CARS ── */}
      <section className="section-pad" style={{ backgroundColor: 'var(--cream)', padding: '100px 2rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
            <div>
              <p style={{ color: 'var(--mid-gray)', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>
                Selezione
              </p>
              <h2 className="serif" style={{ color: 'var(--black)', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Veicoli in Evidenza
              </h2>
            </div>
            <Link to="/auto" style={{
              color: 'var(--text)', textDecoration: 'none',
              fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.06em',
              textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', gap: '8px',
              borderBottom: '1px solid var(--text)', paddingBottom: '2px',
            }}>
              Vedi tutti
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>

          <div className="featured-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2px' }}>
            {featured.map((car, i) => (
              <motion.div key={car.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}>
                <CarCard car={car} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEW vs USED ── */}
      <section style={{ backgroundColor: 'var(--black)', padding: '0' }}>
        <div className="split-grid" style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          {[
            {
              to: '/auto?condizione=new',
              label: 'Nuovo',
              title: 'Auto Nuove',
              desc: `${newCount} vetture di prima immatricolazione. Garanzia ufficiale casa madre, allestimenti completi, consegna immediata.`,
              img: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop',
            },
            {
              to: '/auto?condizione=used',
              label: 'Usato',
              title: 'Auto Usate',
              desc: `${usedCount} veicoli selezionati e certificati. Ogni auto viene ispezionata, documentata e garantita per 12 mesi.`,
              img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop',
            },
          ].map(item => (
            <Link key={item.to} to={item.to} className="split-item" style={{
              textDecoration: 'none', position: 'relative',
              overflow: 'hidden', display: 'block', minHeight: '460px',
            }}>
              <img src={item.img} alt={item.title}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35, transition: 'all 0.6s cubic-bezier(0.4,0,0.2,1)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, transparent 60%)' }} />
              <div style={{ position: 'relative', zIndex: 1, padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}
                onMouseEnter={e => { const img = e.currentTarget.parentElement?.querySelector('img') as HTMLImageElement; if (img) img.style.opacity = '0.5'; if (img) img.style.transform = 'scale(1.04)'; }}
                onMouseLeave={e => { const img = e.currentTarget.parentElement?.querySelector('img') as HTMLImageElement; if (img) img.style.opacity = '0.35'; if (img) img.style.transform = 'none'; }}
              >
                <p style={{ color: 'var(--red)', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 500 }}>{item.label}</p>
                <h3 className="serif" style={{ color: 'white', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 400, marginBottom: '14px' }}>{item.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: '360px', marginBottom: '24px', fontWeight: 300 }}>{item.desc}</p>
                <span style={{
                  color: 'white', fontSize: '0.75rem', fontWeight: 500,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '3px',
                }}>
                  Scopri la selezione
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="section-pad" style={{ backgroundColor: 'white', padding: '100px 2rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="whyus-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '80px', alignItems: 'start' }}>
            <div className="whyus-sticky" style={{ position: 'sticky', top: '100px' }}>
              <p style={{ color: 'var(--mid-gray)', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>Perché noi</p>
              <h2 className="serif" style={{ color: 'var(--black)', fontSize: 'clamp(1.8rem, 2.8vw, 2.6rem)', fontWeight: 400, lineHeight: 1.15, marginBottom: '20px' }}>
                La differenza di un acquisto consapevole
              </h2>
              <p style={{ color: 'var(--mid-gray)', fontSize: '0.9rem', lineHeight: 1.8, fontWeight: 300 }}>
                Dal {dealer.founded} aiutiamo le famiglie di {dealer.city} a trovare l'auto giusta. Senza pressioni, senza sorprese.
              </p>
            </div>
            <div className="whyus-features" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', backgroundColor: 'var(--warm-gray)' }}>
              {[
                { num: '01', title: 'Garanzia Legale', desc: 'Ogni veicolo usato è coperto da garanzia legale di conformità per 12 mesi. Nessuna clausola nascosta.' },
                { num: '02', title: 'Finanziamento Trasparente', desc: 'Simulazione rata personalizzata in 5 minuti. TAN e TAEG chiari. Nessuna commissione nascosta.' },
                { num: '03', title: 'Veicoli Certificati', desc: 'Ispezione meccanica completa, storico chilometrico verificato, documentazione originale sempre presente.' },
                { num: '04', title: 'Pratiche Incluse', desc: 'Passaggio di proprietà, estensione assicurativa e revisione: gestiamo tutto noi, senza costi extra.' },
                { num: '05', title: 'Assistenza Continua', desc: 'Officina convenzionata per tagliandi e riparazioni. Il nostro rapporto non finisce con la firma.' },
                { num: '06', title: 'Risposta in Minuti', desc: 'WhatsApp attivo 6 giorni su 7. Risposta garantita entro l\'orario di apertura.' },
              ].map(item => (
                <div key={item.num} style={{
                  backgroundColor: 'white', padding: '32px',
                  transition: 'background 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--cream)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <p style={{ color: 'var(--red)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.12em', marginBottom: '12px' }}>{item.num}</p>
                  <h3 style={{ color: 'var(--black)', fontWeight: 500, fontSize: '0.95rem', marginBottom: '8px' }}>{item.title}</h3>
                  <p style={{ color: 'var(--mid-gray)', fontSize: '0.82rem', lineHeight: 1.7, fontWeight: 300 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        backgroundColor: 'var(--red)', padding: '80px 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
      }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ maxWidth: '560px' }}>
          <h2 className="serif" style={{ color: 'white', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, marginBottom: '16px', lineHeight: 1.1 }}>
            Trovare l'auto giusta<br />non deve essere complicato.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', lineHeight: 1.75, marginBottom: '36px', fontWeight: 300 }}>
            Vieni in showroom o scrivici su WhatsApp. Ti ascoltiamo, ti consigliamo, ti accompagniamo fino alla firma — senza fretta.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={`https://wa.me/${dealer.whatsapp}`} target="_blank" rel="noopener noreferrer"
              style={{
                backgroundColor: 'white', color: 'var(--red)',
                textDecoration: 'none', padding: '14px 28px',
                fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.04em',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--black)'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = 'var(--red)'; }}
            >
              Scrivici su WhatsApp
            </a>
            <Link to="/auto" style={{
              backgroundColor: 'transparent', color: 'white',
              textDecoration: 'none', padding: '14px 28px',
              fontSize: '0.875rem', fontWeight: 500, letterSpacing: '0.04em',
              border: '1px solid rgba(255,255,255,0.4)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'white'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'}
            >
              Sfoglia i veicoli
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}