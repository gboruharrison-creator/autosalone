import { Link } from 'react-router-dom';
import type { Car } from '../types';

const fuelLabel: Record<string, string> = {
  benzina: 'Benzina', diesel: 'Diesel', ibrido: 'Ibrido',
  elettrico: 'Elettrico', gpl: 'GPL', metano: 'Metano',
};

export default function CarCard({ car, large = false }: { car: Car; large?: boolean }) {
  return (
    <Link to={`/auto/${car.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <article style={{
        backgroundColor: 'white', borderRadius: '4px',
        overflow: 'hidden', height: '100%',
        border: '1px solid var(--warm-gray)',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-6px)';
          e.currentTarget.style.boxShadow = '0 24px 48px rgba(10,10,10,0.12)';
          e.currentTarget.style.borderColor = 'var(--black)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.borderColor = 'var(--warm-gray)';
        }}
      >
        {/* Photo */}
        <div style={{ position: 'relative', overflow: 'hidden', height: large ? '280px' : '220px', backgroundColor: '#E8E5DF', flexShrink: 0 }}>
          <img
            src={car.photos[0]}
            alt={`${car.brand} ${car.model}`}
            loading="lazy"
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1)',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />

          {/* Condition tag */}
          <div style={{
            position: 'absolute', top: '14px', left: '14px',
            backgroundColor: car.condition === 'new' ? 'var(--red)' : 'var(--black)',
            color: 'white', fontSize: '0.65rem', fontWeight: 600,
            padding: '4px 10px', letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}>
            {car.condition === 'new' ? 'Nuovo' : 'Usato'}
          </div>

          {/* Badge */}
          {car.badge && car.badge !== 'Riservata' && (
            <div style={{
              position: 'absolute', top: '14px', right: '14px',
              backgroundColor: 'rgba(245,243,239,0.95)',
              color: 'var(--text)', fontSize: '0.65rem', fontWeight: 600,
              padding: '4px 10px', letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              {car.badge}
            </div>
          )}

          {/* Status overlay */}
          {car.status !== 'available' && (
            <div style={{
              position: 'absolute', inset: 0,
              backgroundColor: 'rgba(10,10,10,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                backgroundColor: 'rgba(245,243,239,0.95)',
                color: 'var(--text)', fontSize: '0.75rem',
                fontWeight: 600, padding: '8px 20px',
                letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                {car.status === 'reserved' ? 'Riservata' : 'Venduta'}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '20px 22px 22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* Brand + model */}
          <div style={{ marginBottom: '10px' }}>
            <p style={{ color: 'var(--mid-gray)', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '3px' }}>
              {car.brand}
            </p>
            <h3 className="serif" style={{ color: 'var(--black)', fontSize: '1.2rem', fontWeight: 400, lineHeight: 1.2, marginBottom: '2px' }}>
              {car.model}
            </h3>
            <p style={{ color: 'var(--mid-gray)', fontSize: '0.78rem', fontWeight: 400 }}>
              {car.version}
            </p>
          </div>

          {/* Key specs — minimal, inline */}
          <div style={{
            display: 'flex', gap: '16px', flexWrap: 'wrap',
            padding: '12px 0',
            borderTop: '1px solid var(--warm-gray)',
            borderBottom: '1px solid var(--warm-gray)',
            marginBottom: '14px',
          }}>
            {[
              car.condition === 'new' ? '0 km' : `${car.mileage.toLocaleString('it')} km`,
              fuelLabel[car.fuel],
              String(car.year),
              `${car.power} cv`,
            ].map(spec => (
              <span key={spec} style={{ color: 'var(--mid-gray)', fontSize: '0.75rem', fontWeight: 400 }}>
                {spec}
              </span>
            ))}
          </div>

          {/* Price */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
            <div>
              <p className="serif" style={{ color: 'var(--red)', fontSize: '1.5rem', fontWeight: 400, lineHeight: 1 }}>
                €{car.price.toLocaleString('it')}
              </p>
              {car.monthlyRate && (
                <p style={{ color: 'var(--mid-gray)', fontSize: '0.72rem', marginTop: '3px' }}>
                  da €{car.monthlyRate}/mese
                </p>
              )}
            </div>
            <div style={{
              fontSize: '0.72rem', fontWeight: 500,
              color: 'var(--mid-gray)', letterSpacing: '0.06em',
              textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              Dettagli
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}