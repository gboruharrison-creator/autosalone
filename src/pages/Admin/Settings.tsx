import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { updateDealer } from '../../lib/db';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const { dealer, refreshDealer } = useAuthStore();
  const [form, setForm] = useState({
    name: dealer?.name || '',
    tagline: dealer?.tagline || '',
    address: dealer?.address || '',
    city: dealer?.city || '',
    province: dealer?.province || '',
    phone: dealer?.phone || '',
    whatsapp: dealer?.whatsapp || '',
    email: dealer?.email || '',
  });
  const [loading, setLoading] = useState(false);

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealer?.id) return;
    setLoading(true);
    try {
      await updateDealer(dealer.id, form);
      await refreshDealer();
      toast.success('Impostazioni salvate');
    } catch {
      toast.error('Errore salvataggio');
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: '100%', padding: '11px 14px',
    border: '1px solid var(--warm-gray)',
    backgroundColor: 'white',
    color: 'var(--text)', fontSize: '0.875rem',
    outline: 'none', fontFamily: 'DM Sans, sans-serif',
    boxSizing: 'border-box' as const, transition: 'border-color 0.2s',
  };

  const fields = [
    { field: 'name', label: 'Nome Concessionaria', placeholder: 'AutoRossi' },
    { field: 'tagline', label: 'Tagline', placeholder: 'La tua concessionaria di fiducia dal 1998' },
    { field: 'address', label: 'Indirizzo', placeholder: 'Via Roma 47' },
    { field: 'city', label: 'Città', placeholder: 'Campobasso' },
    { field: 'province', label: 'Provincia', placeholder: 'CB' },
    { field: 'phone', label: 'Telefono', placeholder: '+39 0874 123456' },
    { field: 'whatsapp', label: 'WhatsApp (con prefisso)', placeholder: '393511234567' },
    { field: 'email', label: 'Email', placeholder: 'info@concessionaria.it' },
  ];

  return (
    <div style={{ padding: '40px', maxWidth: '700px' }}>
      <div style={{ marginBottom: '40px' }}>
        <p style={{ color: 'var(--mid-gray)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px' }}>Configurazione</p>
        <h1 className="serif" style={{ color: 'var(--black)', fontSize: '2rem', fontWeight: 400 }}>Impostazioni</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ backgroundColor: 'white', padding: '32px', marginBottom: '2px' }}>
          <p style={{ color: 'var(--mid-gray)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '24px' }}>
            Dati Concessionaria
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {fields.map(f => (
              <div key={f.field} style={{ gridColumn: ['name', 'tagline', 'address'].includes(f.field) ? 'span 2' : 'span 1' }}>
                <label style={{ display: 'block', color: 'var(--mid-gray)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>{f.label}</label>
                <input value={(form as any)[f.field]} onChange={e => update(f.field, e.target.value)}
                  placeholder={f.placeholder} style={inp}
                  onFocus={e => e.target.style.borderColor = 'var(--red)'}
                  onBlur={e => e.target.style.borderColor = 'var(--warm-gray)'} />
              </div>
            ))}
          </div>
        </div>

        {/* Plan info */}
        <div style={{ backgroundColor: 'var(--black)', padding: '24px 32px', marginBottom: '2px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>Piano Attivo</p>
            <p className="serif" style={{ color: 'white', fontSize: '1.3rem', fontWeight: 400, textTransform: 'capitalize' }}>{dealer?.plan || 'Starter'}</p>
          </div>
          <a href="mailto:info@autosalone.io" style={{ backgroundColor: 'var(--red)', color: 'white', textDecoration: 'none', padding: '10px 20px', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Upgrade Piano →
          </a>
        </div>

        <button type="submit" disabled={loading} style={{
          width: '100%', backgroundColor: loading ? 'var(--mid-gray)' : 'var(--red)',
          color: 'white', border: 'none', padding: '15px',
          fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase',
          cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif',
        }}>
          {loading ? 'Salvataggio...' : 'Salva Impostazioni'}
        </button>
      </form>
    </div>
  );
}