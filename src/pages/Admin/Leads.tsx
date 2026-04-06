import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { getLeads, updateLead, type LeadData } from '../../lib/db';
import toast from 'react-hot-toast';

const statusOptions = [
  { value: 'new', label: 'Nuovo', bg: '#EEF2FF', color: '#4338CA' },
  { value: 'contacted', label: 'Contattato', bg: '#FEF3C7', color: '#92400E' },
  { value: 'interested', label: 'Interessato', bg: '#F0FDF4', color: '#166534' },
  { value: 'sold', label: 'Venduto', bg: '#ECFDF5', color: '#065F46' },
  { value: 'lost', label: 'Perso', bg: '#FEE2E2', color: '#991B1B' },
];

export default function AdminLeads() {
  const { dealer } = useAuthStore();
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!dealer?.id) {
      setLoading(false);
      return;
    }
    getLeads(dealer.id)
      .then(l => setLeads(l))
      .catch(err => console.error('Leads error:', err))
      .finally(() => setLoading(false));
  }, [dealer?.id]);

  const handleStatus = async (id: string, status: string) => {
    await updateLead(id, { status: status as any });
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: status as any } : l));
    toast.success('Stato aggiornato');
  };

  const filtered = filter === 'all' ? leads : leads.filter(l => l.status === filter);

  const getStatusStyle = (status: string) => statusOptions.find(s => s.value === status) || statusOptions[0];

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ marginBottom: '32px' }}>
        <p style={{ color: 'var(--mid-gray)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px' }}>Gestione</p>
        <h1 className="serif" style={{ color: 'var(--black)', fontSize: '2rem', fontWeight: 400 }}>
          Lead · {leads.length}
        </h1>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '2px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[{ value: 'all', label: `Tutti · ${leads.length}` }, ...statusOptions.map(s => ({ value: s.value, label: `${s.label} · ${leads.filter(l => l.status === s.value).length}` }))].map(tab => (
          <button key={tab.value} onClick={() => setFilter(tab.value)} style={{
            padding: '8px 16px',
            backgroundColor: filter === tab.value ? 'var(--black)' : 'white',
            color: filter === tab.value ? 'white' : 'var(--mid-gray)',
            border: '1px solid var(--warm-gray)', cursor: 'pointer',
            fontSize: '0.75rem', fontWeight: 500, fontFamily: 'DM Sans, sans-serif',
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
          <p className="serif" style={{ color: 'var(--black)', fontSize: '1.4rem', fontWeight: 400, marginBottom: '8px' }}>Nessun lead</p>
          <p style={{ color: 'var(--mid-gray)', fontSize: '0.875rem' }}>I lead arriveranno quando i clienti compilano il modulo contatti</p>
        </div>
      ) : (
        <div style={{ backgroundColor: 'white' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px 160px 140px', gap: '16px', padding: '12px 20px', borderBottom: '1px solid var(--warm-gray)', backgroundColor: 'var(--cream)' }}>
            {['Cliente', 'Telefono', 'Fonte', 'Interesse', 'Stato'].map(h => (
              <span key={h} style={{ color: 'var(--mid-gray)', fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{h}</span>
            ))}
          </div>
          {filtered.map(lead => {
            const s = getStatusStyle(lead.status);
            return (
              <div key={lead.id} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px 160px 140px', gap: '16px', padding: '16px 20px', borderBottom: '1px solid var(--warm-gray)', alignItems: 'center' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--cream)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div>
                  <p style={{ color: 'var(--black)', fontWeight: 500, fontSize: '0.875rem' }}>{lead.name}</p>
                  {lead.email && <p style={{ color: 'var(--mid-gray)', fontSize: '0.72rem', marginTop: '1px' }}>{lead.email}</p>}
                  {lead.carName && <p style={{ color: 'var(--red)', fontSize: '0.72rem', marginTop: '1px' }}>🚗 {lead.carName}</p>}
                </div>
                <a href={`tel:${lead.phone}`} style={{ color: 'var(--text)', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500, borderBottom: '1px solid var(--warm-gray)', paddingBottom: '1px' }}>
                  {lead.phone}
                </a>
                <span style={{ color: 'var(--mid-gray)', fontSize: '0.75rem', textTransform: 'capitalize' }}>{lead.source}</span>
                <p style={{ color: 'var(--mid-gray)', fontSize: '0.78rem', fontWeight: 300 }}>
                  {lead.message?.slice(0, 60)}{(lead.message?.length || 0) > 60 ? '...' : ''}
                </p>
                <select value={lead.status} onChange={e => handleStatus(lead.id!, e.target.value)}
                  style={{ backgroundColor: s.bg, color: s.color, border: 'none', padding: '5px 10px', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.04em', outline: 'none', width: '100%' }}>
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}