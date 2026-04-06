import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { getCars, deleteCar, updateCar, type CarData } from '../../lib/db';
import toast from 'react-hot-toast';

export default function AdminCars() {
  const { dealer } = useAuthStore();
  const [cars, setCars] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'used'>('all');

  useEffect(() => {
    if (!dealer?.id) {
      setLoading(false);
      return;
    }
    getCars(dealer.id)
      .then(c => setCars(c))
      .catch(err => console.error('Cars error:', err))
      .finally(() => setLoading(false));
  }, [dealer?.id]);

  const filtered = cars.filter(c => filter === 'all' || c.condition === filter);

  const handleDelete = async (id: string, brand: string, model: string) => {
    if (!confirm(`Eliminare ${brand} ${model}?`)) return;
    await deleteCar(id);
    setCars(prev => prev.filter(c => c.id !== id));
    toast.success('Veicolo eliminato');
  };

  const handleToggleStatus = async (car: CarData) => {
    const newStatus = car.status === 'available' ? 'sold' : 'available';
    await updateCar(car.id!, { status: newStatus });
    setCars(prev => prev.map(c => c.id === car.id ? { ...c, status: newStatus } : c));
    toast.success(newStatus === 'available' ? 'Marcato disponibile' : 'Marcato venduto');
  };

  const statusColors: Record<string, { bg: string; color: string }> = {
    available: { bg: '#ECFDF5', color: '#065F46' },
    reserved: { bg: '#FEF3C7', color: '#92400E' },
    sold: { bg: '#FEE2E2', color: '#991B1B' },
  };
  const statusLabels: Record<string, string> = {
    available: 'Disponibile', reserved: 'Riservata', sold: 'Venduta',
  };

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <p style={{ color: 'var(--mid-gray)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px' }}>Gestione</p>
          <h1 className="serif" style={{ color: 'var(--black)', fontSize: '2rem', fontWeight: 400 }}>Veicoli</h1>
        </div>
        <Link to="/admin/auto/nuovo" style={{
          backgroundColor: 'var(--red)', color: 'white', textDecoration: 'none',
          padding: '11px 22px', fontSize: '0.8rem', fontWeight: 500,
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          + Aggiungi Veicolo
        </Link>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '2px', marginBottom: '24px' }}>
        {[
          { value: 'all', label: `Tutti (${cars.length})` },
          { value: 'new', label: `Nuovi (${cars.filter(c => c.condition === 'new').length})` },
          { value: 'used', label: `Usati (${cars.filter(c => c.condition === 'used').length})` },
        ].map(tab => (
          <button key={tab.value} onClick={() => setFilter(tab.value as any)} style={{
            padding: '8px 18px',
            backgroundColor: filter === tab.value ? 'var(--black)' : 'white',
            color: filter === tab.value ? 'white' : 'var(--mid-gray)',
            border: '1px solid var(--warm-gray)',
            fontSize: '0.78rem', fontWeight: 500, cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s',
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ width: '28px', height: '28px', border: '2px solid var(--warm-gray)', borderTopColor: 'var(--red)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ backgroundColor: 'white', padding: '60px', textAlign: 'center' }}>
          <p className="serif" style={{ color: 'var(--black)', fontSize: '1.4rem', fontWeight: 400, marginBottom: '10px' }}>
            Nessun veicolo
          </p>
          <p style={{ color: 'var(--mid-gray)', marginBottom: '20px', fontSize: '0.875rem' }}>
            Aggiungi il tuo primo veicolo al catalogo
          </p>
          <Link to="/admin/auto/nuovo" style={{ color: 'var(--red)', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}>
            + Aggiungi veicolo
          </Link>
        </div>
      ) : (
        <div style={{ backgroundColor: 'white' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 100px 100px 120px 120px', gap: '16px', padding: '12px 20px', borderBottom: '1px solid var(--warm-gray)', backgroundColor: 'var(--cream)' }}>
            {['Foto', 'Veicolo', 'Anno/Km', 'Prezzo', 'Stato', 'Azioni'].map(h => (
              <span key={h} style={{ color: 'var(--mid-gray)', fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{h}</span>
            ))}
          </div>
          {filtered.map(car => (
            <div key={car.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 100px 100px 120px 120px', gap: '16px', padding: '14px 20px', borderBottom: '1px solid var(--warm-gray)', alignItems: 'center', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--cream)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {/* Photo */}
              <div style={{ width: '72px', height: '52px', overflow: 'hidden', backgroundColor: 'var(--warm-gray)', flexShrink: 0 }}>
                {car.photos[0] ? (
                  <img src={car.photos[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--mid-gray)', fontSize: '1.2rem' }}>🚗</div>
                )}
              </div>
              {/* Name */}
              <div>
                <p style={{ color: 'var(--black)', fontWeight: 500, fontSize: '0.875rem' }}>{car.brand} {car.model}</p>
                <p style={{ color: 'var(--mid-gray)', fontSize: '0.72rem', marginTop: '1px' }}>{car.version}</p>
                <span style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', backgroundColor: car.condition === 'new' ? '#FEE2E2' : '#EEF2FF', color: car.condition === 'new' ? 'var(--red)' : '#3730A3', padding: '2px 7px', marginTop: '3px', display: 'inline-block' }}>
                  {car.condition === 'new' ? 'Nuovo' : 'Usato'}
                </span>
              </div>
              {/* Year/km */}
              <div>
                <p style={{ color: 'var(--text)', fontSize: '0.82rem' }}>{car.year}</p>
                <p style={{ color: 'var(--mid-gray)', fontSize: '0.72rem' }}>{car.condition === 'new' ? '0 km' : `${car.mileage?.toLocaleString('it')} km`}</p>
              </div>
              {/* Price */}
              <p style={{ color: 'var(--red)', fontWeight: 600, fontSize: '0.875rem' }}>€{car.price?.toLocaleString('it')}</p>
              {/* Status */}
              <button onClick={() => handleToggleStatus(car)} title="Clicca per cambiare stato" style={{
                ...statusColors[car.status],
                border: 'none', cursor: 'pointer',
                padding: '4px 10px', fontSize: '0.62rem', fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                fontFamily: 'DM Sans, sans-serif', width: 'fit-content',
              }}>
                {statusLabels[car.status]}
              </button>
              {/* Actions */}
              <div style={{ display: 'flex', gap: '6px' }}>
                <Link to={`/auto/${car.id}`} target="_blank" style={{ padding: '6px 10px', backgroundColor: 'var(--cream)', border: '1px solid var(--warm-gray)', color: 'var(--text)', textDecoration: 'none', fontSize: '0.72rem', transition: 'all 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--black)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--warm-gray)'}
                >
                  👁
                </Link>
                <Link to={`/admin/auto/${car.id}/modifica`} style={{ padding: '6px 10px', backgroundColor: 'var(--black)', color: 'white', textDecoration: 'none', fontSize: '0.72rem' }}>
                  ✏
                </Link>
                <button onClick={() => handleDelete(car.id!, car.brand, car.model)} style={{ padding: '6px 10px', backgroundColor: '#FEE2E2', border: 'none', color: '#991B1B', cursor: 'pointer', fontSize: '0.72rem' }}>
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}