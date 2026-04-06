import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { getById, getSimilar } from '../../data/cars';
import { dealer } from '../../data/dealer';
import CarCard from '../../components/CarCard';

const fuelLabel: Record<string, string> = {
  benzina: 'Benzina', diesel: 'Diesel', ibrido: 'Ibrido',
  elettrico: 'Elettrico', gpl: 'GPL', metano: 'Metano',
};

export default function CarDetail() {
  const { id } = useParams<{ id: string }>();
  const car = getById(id || '');
  const [activePhoto, setActivePhoto] = useState(0);
  const [deposit, setDeposit] = useState(3000);
  const [months, setMonths] = useState(48);
  const rate = 5.9;

  if (!car) {
    return (
      <div style={{ textAlign: 'center', padding: '140px 2rem', backgroundColor: 'var(--cream)', minHeight: '100vh' }}>
        <p className="serif" style={{ color: 'var(--black)', fontSize: '2rem', fontWeight: 400, marginBottom: '12px' }}>
          Veicolo non trovato
        </p>
        <Link to="/auto" style={{ color: 'var(--red)', fontSize: '0.875rem', fontWeight: 500 }}>
          ← Torna ai veicoli
        </Link>
      </div>
    );
  }

  const similar = getSimilar(car, 3);
  const loanAmount = car.price - deposit;
  const monthlyPayment = loanAmount > 0
    ? Math.round((loanAmount * (rate / 100 / 12)) / (1 - Math.pow(1 + rate / 100 / 12, -months)))
    : 0;
  const whatsappText = `Ciao! Sono interessato alla ${car.brand} ${car.model} ${car.version} (€${car.price.toLocaleString('it')}) sul vostro sito. Posso avere maggiori informazioni?`;

  return (
    <>
      <Helmet>
        <title>{car.brand} {car.model} {car.version} {car.year} — {dealer.name}</title>
        <meta name="description" content={`${car.brand} ${car.model} ${car.version}, ${car.year}, ${car.condition === 'used' ? car.mileage.toLocaleString('it') + ' km, ' : '0 km, '}€${car.price.toLocaleString('it')}. ${car.description.slice(0, 100)}`} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org/',
          '@type': 'Car',
          name: `${car.brand} ${car.model} ${car.version}`,
          brand: { '@type': 'Brand', name: car.brand },
          modelDate: car.year,
          mileageFromOdometer: { '@type': 'QuantitativeValue', value: car.mileage, unitCode: 'KMT' },
          offers: { '@type': 'Offer', price: car.price, priceCurrency: 'EUR', availability: car.status === 'available' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
        })}</script>
      </Helmet>

      <div style={{ paddingTop: '68px', backgroundColor: 'var(--cream)', minHeight: '100vh' }}>

        {/* Breadcrumb */}
        <div style={{ backgroundColor: 'white', borderBottom: '1px solid var(--warm-gray)', padding: '12px 2rem' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--mid-gray)', letterSpacing: '0.02em' }}>
            <Link to="/" style={{ color: 'var(--mid-gray)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--mid-gray)'}>
              Home
            </Link>
            <span>›</span>
            <Link to="/auto" style={{ color: 'var(--mid-gray)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--mid-gray)'}>
              Veicoli
            </Link>
            <span>›</span>
            <Link to={`/auto?condizione=${car.condition}`} style={{ color: 'var(--mid-gray)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--mid-gray)'}>
              {car.condition === 'new' ? 'Nuove' : 'Usate'}
            </Link>
            <span>›</span>
            <span style={{ color: 'var(--text)' }}>{car.brand} {car.model}</span>
          </div>
        </div>

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 2rem 80px' }}>
          <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) 400px', gap: '40px', alignItems: 'start' }}>

            {/* Left */}
            <div>
              {/* Main photo */}
              <div style={{ position: 'relative', overflow: 'hidden', backgroundColor: 'var(--warm-gray)', marginBottom: '8px', aspectRatio: '16/10' }}>
                <motion.img
                  key={activePhoto}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}
                  src={car.photos[activePhoto]}
                  alt={`${car.brand} ${car.model}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                {/* Condition */}
                <div style={{
                  position: 'absolute', top: '16px', left: '16px',
                  backgroundColor: car.condition === 'new' ? 'var(--red)' : 'var(--black)',
                  color: 'white', fontSize: '0.65rem', fontWeight: 600,
                  padding: '5px 12px', letterSpacing: '0.12em', textTransform: 'uppercase',
                }}>
                  {car.condition === 'new' ? 'Nuovo' : 'Usato'}
                </div>

                {/* Photo nav */}
                {car.photos.length > 1 && (
                  <>
                    <button onClick={() => setActivePhoto(p => (p - 1 + car.photos.length) % car.photos.length)}
                      style={{
                        position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                        width: '40px', height: '40px', backgroundColor: 'rgba(10,10,10,0.5)',
                        border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backdropFilter: 'blur(4px)', transition: 'background 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(10,10,10,0.8)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(10,10,10,0.5)'}
                    >‹</button>
                    <button onClick={() => setActivePhoto(p => (p + 1) % car.photos.length)}
                      style={{
                        position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                        width: '40px', height: '40px', backgroundColor: 'rgba(10,10,10,0.5)',
                        border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backdropFilter: 'blur(4px)', transition: 'background 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(10,10,10,0.8)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(10,10,10,0.5)'}
                    >›</button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {car.photos.map((photo: string, i: number) => (
                  <button key={i} onClick={() => setActivePhoto(i)} style={{
                    width: '80px', height: '56px', border: 'none',
                    padding: 0, cursor: 'pointer', overflow: 'hidden',
                    outline: activePhoto === i ? '2px solid var(--red)' : '2px solid transparent',
                    outlineOffset: '1px', transition: 'outline 0.15s', flexShrink: 0,
                  }}>
                    <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: activePhoto === i ? 1 : 0.55, transition: 'opacity 0.2s' }} />
                  </button>
                ))}
              </div>

              {/* Description */}
              <div style={{ marginTop: '36px', paddingTop: '36px', borderTop: '1px solid var(--warm-gray)' }}>
                <p style={{ color: 'var(--mid-gray)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>
                  Descrizione
                </p>
                <p style={{ color: 'var(--text)', lineHeight: 1.9, fontSize: '0.9rem', fontWeight: 300 }}>
                  {car.description}
                </p>
              </div>

              {/* Specs grid */}
              <div style={{ marginTop: '36px', paddingTop: '36px', borderTop: '1px solid var(--warm-gray)' }}>
                <p style={{ color: 'var(--mid-gray)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '20px' }}>
                  Caratteristiche
                </p>
                <div className="specs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', backgroundColor: 'var(--warm-gray)' }}>
                  {[
                    { label: 'Anno', value: car.year },
                    { label: 'Chilometri', value: car.condition === 'new' ? '0 km' : `${car.mileage.toLocaleString('it')} km` },
                    { label: 'Carburante', value: fuelLabel[car.fuel] },
                    { label: 'Cambio', value: car.gearbox.charAt(0).toUpperCase() + car.gearbox.slice(1) },
                    { label: 'Potenza', value: `${car.power} cv` },
                    { label: 'Carrozzeria', value: car.bodyType.charAt(0).toUpperCase() + car.bodyType.slice(1) },
                    { label: 'Colore', value: car.colour },
                    { label: 'Porte', value: car.doors },
                    { label: 'Posti', value: car.seats },
                    { label: 'Garanzia', value: `${car.warranty} mesi` },
                    ...(car.co2 ? [{ label: 'CO₂', value: `${car.co2} g/km` }] : []),
                    ...(car.consumption ? [{ label: 'Consumo', value: car.consumption }] : []),
                  ].map(spec => (
                    <div key={spec.label} style={{ backgroundColor: 'white', padding: '16px 20px' }}>
                      <p style={{ color: 'var(--mid-gray)', fontSize: '0.68rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                        {spec.label}
                      </p>
                      <p style={{ color: 'var(--black)', fontWeight: 500, fontSize: '0.875rem' }}>
                        {spec.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div style={{ marginTop: '36px', paddingTop: '36px', borderTop: '1px solid var(--warm-gray)' }}>
                <p style={{ color: 'var(--mid-gray)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '18px' }}>
                  Optional e Dotazioni
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px' }}>
                  {car.features.map((f: string) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '5px', height: '5px', backgroundColor: 'var(--red)', flexShrink: 0 }} />
                      <span style={{ color: 'var(--text)', fontSize: '0.82rem', fontWeight: 400 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — sticky panel */}
            <div className="detail-sticky" style={{ position: 'sticky', top: '90px', display: 'flex', flexDirection: 'column', gap: '2px' }}>

              {/* Title + price */}
              <div style={{ backgroundColor: 'white', padding: '28px', border: '1px solid var(--warm-gray)' }}>
                <p style={{ color: 'var(--mid-gray)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>
                  {car.brand}
                </p>
                <h1 className="serif" style={{ color: 'var(--black)', fontSize: '1.8rem', fontWeight: 400, lineHeight: 1.1, marginBottom: '4px' }}>
                  {car.model}
                </h1>
                <p style={{ color: 'var(--mid-gray)', fontSize: '0.85rem', marginBottom: '20px', fontWeight: 300 }}>
                  {car.version}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '20px', borderTop: '1px solid var(--warm-gray)' }}>
                  <div>
                    <p className="serif" style={{ color: 'var(--red)', fontSize: '2.2rem', fontWeight: 400, lineHeight: 1 }}>
                      €{car.price.toLocaleString('it')}
                    </p>
                    {car.monthlyRate && (
                      <p style={{ color: 'var(--mid-gray)', fontSize: '0.75rem', marginTop: '4px', fontWeight: 300 }}>
                        da €{car.monthlyRate}/mese
                      </p>
                    )}
                  </div>
                  <div style={{
                    backgroundColor: car.status === 'available' ? '#ECFDF5' : '#FEF3C7',
                    color: car.status === 'available' ? '#065F46' : '#92400E',
                    fontSize: '0.65rem', fontWeight: 600, padding: '5px 12px',
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                  }}>
                    {car.status === 'available' ? 'Disponibile' : 'Riservata'}
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div style={{ backgroundColor: 'white', padding: '20px 28px', border: '1px solid var(--warm-gray)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href={`https://wa.me/${dealer.whatsapp}?text=${encodeURIComponent(whatsappText)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    backgroundColor: '#25D366', color: 'white', textDecoration: 'none',
                    padding: '14px', fontSize: '0.875rem', fontWeight: 600,
                    letterSpacing: '0.02em', transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1DAF57'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#25D366'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Chiedi su WhatsApp
                </a>
                <a href={`tel:${dealer.phone}`}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    backgroundColor: 'var(--black)', color: 'white', textDecoration: 'none',
                    padding: '13px', fontSize: '0.875rem', fontWeight: 500,
                    letterSpacing: '0.02em', transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#333'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--black)'}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.1a16 16 0 006 6l.56-.56a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                  {dealer.phone}
                </a>
                <Link to="/contatti"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid var(--warm-gray)', color: 'var(--text)',
                    textDecoration: 'none', padding: '12px', fontSize: '0.82rem',
                    fontWeight: 400, letterSpacing: '0.04em', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--black)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--warm-gray)'; }}
                >
                  Vieni in showroom
                </Link>
              </div>

              {/* Financing calculator */}
              <div style={{ backgroundColor: 'white', padding: '28px', border: '1px solid var(--warm-gray)' }}>
                <p style={{ color: 'var(--mid-gray)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '20px' }}>
                  Calcola la Rata
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: 'var(--mid-gray)', fontSize: '0.78rem' }}>Anticipo</span>
                      <span style={{ color: 'var(--black)', fontWeight: 500, fontSize: '0.82rem' }}>€{deposit.toLocaleString('it')}</span>
                    </div>
                    <input type="range" min="0" max={Math.floor(car.price * 0.5)} step="500"
                      value={deposit} onChange={e => setDeposit(Number(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--red)', cursor: 'pointer' }} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: 'var(--mid-gray)', fontSize: '0.78rem' }}>Durata</span>
                      <span style={{ color: 'var(--black)', fontWeight: 500, fontSize: '0.82rem' }}>{months} mesi</span>
                    </div>
                    <input type="range" min="12" max="84" step="12"
                      value={months} onChange={e => setMonths(Number(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--red)', cursor: 'pointer' }} />
                  </div>

                  {/* Result */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '16px', backgroundColor: 'var(--cream)', borderLeft: '3px solid var(--red)' }}>
                    <div>
                      <p style={{ color: 'var(--mid-gray)', fontSize: '0.68rem', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Rata mensile</p>
                      <p className="serif" style={{ color: 'var(--red)', fontSize: '2rem', fontWeight: 400, lineHeight: 1 }}>
                        €{monthlyPayment}
                      </p>
                    </div>
                    <p style={{ color: 'var(--mid-gray)', fontSize: '0.65rem', textAlign: 'right', lineHeight: 1.5 }}>
                      TAN {rate}%<br />Solo indicativo
                    </p>
                  </div>

                  <a href={`https://wa.me/${dealer.whatsapp}?text=${encodeURIComponent(`Ciao! Vorrei un preventivo finanziamento per la ${car.brand} ${car.model}. Anticipo €${deposit.toLocaleString('it')}, ${months} mesi.`)}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'block', textAlign: 'center',
                      backgroundColor: 'var(--black)', color: 'white',
                      textDecoration: 'none', padding: '12px',
                      fontSize: '0.78rem', fontWeight: 500, letterSpacing: '0.08em',
                      textTransform: 'uppercase', transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#333'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--black)'}
                  >
                    Richiedi preventivo
                  </a>
                </div>
              </div>

              {/* Warranty */}
              <div style={{ backgroundColor: 'var(--cream)', padding: '18px 24px', border: '1px solid var(--warm-gray)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '3px', height: '40px', backgroundColor: 'var(--red)', flexShrink: 0 }} />
                <div>
                  <p style={{ color: 'var(--text)', fontWeight: 500, fontSize: '0.82rem', marginBottom: '2px' }}>
                    Garanzia legale inclusa
                  </p>
                  <p style={{ color: 'var(--mid-gray)', fontSize: '0.72rem', fontWeight: 300 }}>
                    {car.warranty} mesi · Codice del Consumo art. 128–135
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Similar cars */}
          {similar.length > 0 && (
            <div style={{ marginTop: '80px', paddingTop: '60px', borderTop: '1px solid var(--warm-gray)' }}>
              <p style={{ color: 'var(--mid-gray)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>
                Potrebbe interessarti
              </p>
              <h2 className="serif" style={{ color: 'var(--black)', fontSize: '1.8rem', fontWeight: 400, marginBottom: '32px' }}>
                Veicoli Simili
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2px' }}>
                {similar.map((c: import('../../types').Car) => <CarCard key={c.id} car={c} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}