import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { getCars, getLeads, type CarData, type LeadData } from '../../lib/db';

export default function AdminDashboard() {
  const { dealer } = useAuthStore();
  const [cars, setCars] = useState<CarData[]>([]);
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dealer?.id) {
      setLoading(false);
      return;
    }
    Promise.all([getCars(dealer.id), getLeads(dealer.id)])
      .then(([c, l]) => {
        setCars(c);
        setLeads(l);
      })
      .catch(err => console.error('Dashboard error:', err))
      .finally(() => setLoading(false));
  }, [dealer?.id]);

  const available = cars.filter(c => c.status === 'available').length;
  const newCars = cars.filter(c => c.condition === 'new').length;
  const usedCars = cars.filter(c => c.condition === 'used').length;
  const newLeads = leads.filter(l => l.status === 'new').length;

  const stats = [
    { label: 'Veicoli Totali', value: cars.length, sub: `${available} disponibili`, color: 'var(--black)' },
    { label: 'Auto Nuove', value: newCars, sub: 'In catalogo', color: 'var(--red)' },
    { label: 'Auto Usate', value: usedCars, sub: 'In catalogo', color: '#2C3E6B' },
    { label: 'Nuovi Lead', value: newLeads, sub: `${leads.length} totali`, color: '#16A34A' },
  ];

  if (loading) return (
    <div style={{ padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
      <div style={{ width: '32px', height: '32px', border: '2px solid var(--warm-gray)', borderTopColor: 'var(--red)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ padding: '40px' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <p style={{ color: 'var(--mid-gray)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px' }}>
            Pannello di Controllo
          </p>
          <h1 className="serif" style={{ color: 'var(--black)', fontSize: '2rem', fontWeight: 400 }}>
            Benvenuto{dealer?.name ? `, ${dealer.name}` : ''}
          </h1>
        </div>
        <Link to="/admin/auto/nuovo" style={{
          backgroundColor: 'var(--red)', color: 'white', textDecoration: 'none',
          padding: '11px 22px', fontSize: '0.8rem', fontWeight: 500,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', gap: '8px',
          transition: 'background 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--red-dark)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--red)'}
        >
          + Aggiungi Veicolo
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2px', marginBottom: '40px' }}>
        {stats.map(stat => (
          <div key={stat.label} style={{ backgroundColor: 'white', padding: '24px', borderLeft: `3px solid ${stat.color}` }}>
            <p style={{ color: 'var(--mid-gray)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>
              {stat.label}
            </p>
            <p className="serif" style={{ color: 'var(--black)', fontSize: '2.4rem', fontWeight: 400, lineHeight: 1, marginBottom: '4px' }}>
              {loading ? '–' : stat.value}
            </p>
            <p style={{ color: 'var(--mid-gray)', fontSize: '0.75rem', fontWeight: 300 }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
        {/* Recent cars */}
        <div style={{ backgroundColor: 'white' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--warm-gray)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: 'var(--black)', fontWeight: 500, fontSize: '0.9rem' }}>Ultimi Veicoli</p>
            <Link to="/admin/auto" style={{ color: 'var(--mid-gray)', fontSize: '0.72rem', textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Vedi tutti →
            </Link>
          </div>
          {cars.slice(0, 5).map(car => (
            <div key={car.id} style={{ padding: '14px 24px', borderBottom: '1px solid var(--warm-gray)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: 'var(--black)', fontSize: '0.845rem', fontWeight: 500 }}>{car.brand} {car.model}</p>
                <p style={{ color: 'var(--mid-gray)', fontSize: '0.72rem', marginTop: '1px' }}>{car.year} · {car.condition === 'new' ? 'Nuovo' : 'Usato'}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: 'var(--red)', fontSize: '0.875rem', fontWeight: 500 }}>€{car.price?.toLocaleString('it')}</p>
                <span style={{
                  fontSize: '0.62rem', fontWeight: 600, padding: '2px 8px', letterSpacing: '0.06em', textTransform: 'uppercase',
                  backgroundColor: car.status === 'available' ? '#ECFDF5' : car.status === 'reserved' ? '#FEF3C7' : '#FEE2E2',
                  color: car.status === 'available' ? '#065F46' : car.status === 'reserved' ? '#92400E' : '#991B1B',
                }}>
                  {car.status === 'available' ? 'Disponibile' : car.status === 'reserved' ? 'Riservata' : 'Venduta'}
                </span>
              </div>
            </div>
          ))}
          {cars.length === 0 && (
            <div style={{ padding: '40px 24px', textAlign: 'center' }}>
              <p style={{ color: 'var(--mid-gray)', fontSize: '0.875rem', marginBottom: '12px' }}>Nessun veicolo ancora</p>
              <Link to="/admin/auto/nuovo" style={{ color: 'var(--red)', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 500 }}>
                + Aggiungi il primo veicolo
              </Link>
            </div>
          )}
        </div>

        {/* Recent leads */}
        <div style={{ backgroundColor: 'white' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--warm-gray)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: 'var(--black)', fontWeight: 500, fontSize: '0.9rem' }}>Ultimi Lead</p>
            <Link to="/admin/leads" style={{ color: 'var(--mid-gray)', fontSize: '0.72rem', textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Vedi tutti →
            </Link>
          </div>
          {leads.slice(0, 5).map(lead => (
            <div key={lead.id} style={{ padding: '14px 24px', borderBottom: '1px solid var(--warm-gray)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: 'var(--black)', fontSize: '0.845rem', fontWeight: 500 }}>{lead.name}</p>
                <p style={{ color: 'var(--mid-gray)', fontSize: '0.72rem', marginTop: '1px' }}>{lead.phone} · {lead.source}</p>
              </div>
              <span style={{
                fontSize: '0.62rem', fontWeight: 600, padding: '2px 8px', letterSpacing: '0.06em', textTransform: 'uppercase',
                backgroundColor: lead.status === 'new' ? '#EEF2FF' : lead.status === 'sold' ? '#ECFDF5' : '#F1F5F9',
                color: lead.status === 'new' ? '#4338CA' : lead.status === 'sold' ? '#065F46' : '#475569',
              }}>
                {lead.status === 'new' ? 'Nuovo' : lead.status === 'contacted' ? 'Contattato' : lead.status === 'interested' ? 'Interessato' : lead.status === 'sold' ? 'Venduto' : 'Perso'}
              </span>
            </div>
          ))}
          {leads.length === 0 && (
            <div style={{ padding: '40px 24px', textAlign: 'center' }}>
              <p style={{ color: 'var(--mid-gray)', fontSize: '0.875rem' }}>Nessun lead ancora</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}