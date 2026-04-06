import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { createCar, updateCar, getCarById, uploadCarPhoto, type CarData } from '../../lib/db';
import { generateCarDescription } from '../../lib/ai';
import toast from 'react-hot-toast';

const BRANDS = ['Alfa Romeo','Audi','BMW','Dacia','Ferrari','Fiat','Ford','Honda','Hyundai','Jeep','Kia','Lamborghini','Lancia','Land Rover','Maserati','Mazda','Mercedes-Benz','MG','Mini','Mitsubishi','Nissan','Opel','Peugeot','Porsche','Renault','Seat','Skoda','Suzuki','Tesla','Toyota','Volkswagen','Volvo'];
const FUELS = ['benzina','diesel','ibrido','elettrico','gpl','metano'];
const GEARBOXES = ['manuale','automatico','semiautomatico'];
const BODY_TYPES = ['berlina','suv','station wagon','hatchback','cabrio','coupé','monovolume','pickup'];

const emptyForm: Omit<CarData, 'id' | 'dealerId' | 'createdAt' | 'updatedAt' | 'views'> = {
  condition: 'used', status: 'available',
  brand: '', model: '', version: '',
  year: new Date().getFullYear(), mileage: 0,
  fuel: 'benzina', gearbox: 'manuale', bodyType: 'berlina',
  colour: '', price: 0, monthlyRate: undefined,
  power: 0, doors: 5, seats: 5,
  description: '', features: [], photos: [],
  warranty: 12, co2: undefined, consumption: '',
  featured: false, badge: '',
};

export default function AdminCarForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const { dealer } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [featureInput, setFeatureInput] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEdit) {
      getCarById(id).then(car => {
        if (car) {
          const { id: _id, dealerId: _d, createdAt: _c, updatedAt: _u, views: _v, ...rest } = car;
          setForm(rest as any);
        }
      });
    }
  }, [id]);

  const update = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));

  const handlePhotos = async (files: FileList) => {
    if (!dealer?.id) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadCarPhoto(file, dealer.id);
        urls.push(url);
      }
      update('photos', [...form.photos, ...urls]);
      toast.success(`${urls.length} foto caricate`);
    } catch {
      toast.error('Errore caricamento foto');
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateDesc = async () => {
    if (!form.brand || !form.model) { toast.error('Inserisci marca e modello prima'); return; }
    setGenerating(true);
    try {
      const desc = await generateCarDescription({
        brand: form.brand, model: form.model, version: form.version,
        year: form.year, mileage: form.mileage, fuel: form.fuel,
        gearbox: form.gearbox, colour: form.colour, power: form.power,
        condition: form.condition, features: form.features,
      });
      update('description', desc);
      toast.success('Descrizione generata!');
    } catch {
      toast.error('Errore generazione AI');
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealer?.id) {
      toast.error('Dealer non trovato. Ricarica la pagina.');
      return;
    }
    setLoading(true);
    try {
      const carData = {
        ...form,
        dealerId: dealer.id,
        views: 0,
        price: Number(form.price) || 0,
        mileage: Number(form.mileage) || 0,
        power: Number(form.power) || 0,
        year: Number(form.year) || new Date().getFullYear(),
        doors: Number(form.doors) || 5,
        seats: Number(form.seats) || 5,
        warranty: Number(form.warranty) || 12,
        monthlyRate: form.monthlyRate ? Number(form.monthlyRate) : undefined,
        co2: form.co2 ? Number(form.co2) : undefined,
        features: form.features || [],
        photos: form.photos || [],
        badge: form.badge || '',
        consumption: form.consumption || '',
      };

      console.log('Saving car:', carData);

      if (isEdit) {
        await updateCar(id, carData);
        toast.success('Veicolo aggiornato!');
      } else {
        const newId = await createCar(carData);
        console.log('Car saved with id:', newId);
        toast.success('Veicolo aggiunto!');
      }
      navigate('/admin/auto');
    } catch (err: any) {
      console.error('Save error full:', err);
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);
      toast.error(`Errore: ${err.message || err.code || 'Sconosciuto'}`);
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

  const sel = { ...inp, cursor: 'pointer', appearance: 'none' as const, WebkitAppearance: 'none' as const };

  const section = (title: string) => (
    <div style={{ marginBottom: '8px', paddingTop: '28px', borderTop: '1px solid var(--warm-gray)' }}>
      <p style={{ color: 'var(--mid-gray)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>{title}</p>
    </div>
  );

  return (
    <div style={{ padding: '40px', maxWidth: '900px' }}>
      <div style={{ marginBottom: '32px' }}>
        <p style={{ color: 'var(--mid-gray)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px' }}>
          {isEdit ? 'Modifica Veicolo' : 'Nuovo Veicolo'}
        </p>
        <h1 className="serif" style={{ color: 'var(--black)', fontSize: '2rem', fontWeight: 400 }}>
          {isEdit ? `${form.brand} ${form.model}` : 'Aggiungi Veicolo'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>

        {/* Condition + Status */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', color: 'var(--mid-gray)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>Condizione *</label>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[{ v: 'new', l: 'Nuovo' }, { v: 'used', l: 'Usato' }].map(opt => (
                <button key={opt.v} type="button" onClick={() => update('condition', opt.v)} style={{
                  flex: 1, padding: '11px',
                  backgroundColor: form.condition === opt.v ? 'var(--black)' : 'white',
                  color: form.condition === opt.v ? 'white' : 'var(--mid-gray)',
                  border: '1px solid var(--warm-gray)', cursor: 'pointer',
                  fontSize: '0.82rem', fontWeight: 500, fontFamily: 'DM Sans, sans-serif',
                }}>
                  {opt.l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--mid-gray)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>Stato *</label>
            <select value={form.status} onChange={e => update('status', e.target.value)} style={sel}>
              <option value="available">Disponibile</option>
              <option value="reserved">Riservata</option>
              <option value="sold">Venduta</option>
            </select>
          </div>
        </div>

        {/* Brand + Model + Version */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', color: 'var(--mid-gray)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>Marca *</label>
            <select value={form.brand} onChange={e => update('brand', e.target.value)} required style={sel}>
              <option value="">Seleziona marca</option>
              {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--mid-gray)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>Modello *</label>
            <input value={form.model} onChange={e => update('model', e.target.value)} required placeholder="Es. Golf" style={inp}
              onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--warm-gray)'} />
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--mid-gray)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>Versione</label>
            <input value={form.version} onChange={e => update('version', e.target.value)} placeholder="Es. 1.5 TSI 150cv Style" style={inp}
              onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--warm-gray)'} />
          </div>
        </div>

        {/* Year, Mileage, Colour, Power */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          {[
            { field: 'year', label: 'Anno *', type: 'number', placeholder: '2022' },
            { field: 'mileage', label: 'Chilometri *', type: 'number', placeholder: '0' },
            { field: 'colour', label: 'Colore', type: 'text', placeholder: 'Bianco Perla' },
            { field: 'power', label: 'Potenza (cv)', type: 'number', placeholder: '130' },
          ].map(f => (
            <div key={f.field}>
              <label style={{ display: 'block', color: 'var(--mid-gray)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>{f.label}</label>
              <input type={f.type} value={(form as any)[f.field] || ''} onChange={e => update(f.field, f.type === 'number' ? Number(e.target.value) : e.target.value)}
                placeholder={f.placeholder} style={inp}
                onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--warm-gray)'} />
            </div>
          ))}
        </div>

        {/* Fuel, Gearbox, Body, Doors, Seats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 80px 80px', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', color: 'var(--mid-gray)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>Carburante</label>
            <select value={form.fuel} onChange={e => update('fuel', e.target.value)} style={sel}>
              {FUELS.map(f => <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--mid-gray)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>Cambio</label>
            <select value={form.gearbox} onChange={e => update('gearbox', e.target.value)} style={sel}>
              {GEARBOXES.map(g => <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--mid-gray)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>Carrozzeria</label>
            <select value={form.bodyType} onChange={e => update('bodyType', e.target.value)} style={sel}>
              {BODY_TYPES.map(b => <option key={b} value={b}>{b.charAt(0).toUpperCase() + b.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--mid-gray)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>Porte</label>
            <input type="number" value={form.doors} onChange={e => update('doors', Number(e.target.value))} min={2} max={5} style={inp}
              onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--warm-gray)'} />
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--mid-gray)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>Posti</label>
            <input type="number" value={form.seats} onChange={e => update('seats', Number(e.target.value))} min={2} max={9} style={inp}
              onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--warm-gray)'} />
          </div>
        </div>

        {/* Price, Monthly, Warranty, Badge */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          {[
            { field: 'price', label: 'Prezzo € *', placeholder: '15900' },
            { field: 'monthlyRate', label: 'Rata mensile €', placeholder: '189' },
            { field: 'warranty', label: 'Garanzia (mesi)', placeholder: '12' },
            { field: 'badge', label: 'Badge', placeholder: 'Es. Occasione' },
          ].map(f => (
            <div key={f.field}>
              <label style={{ display: 'block', color: 'var(--mid-gray)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>{f.label}</label>
              <input
                type={f.field === 'badge' ? 'text' : 'number'}
                value={(form as any)[f.field] || ''}
                onChange={e => update(f.field, f.field === 'badge' ? e.target.value : Number(e.target.value))}
                placeholder={f.placeholder} style={inp}
                onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--warm-gray)'} />
            </div>
          ))}
        </div>

        {/* Featured toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <input type="checkbox" id="featured" checked={form.featured} onChange={e => update('featured', e.target.checked)} style={{ width: '16px', height: '16px', accentColor: 'var(--red)', cursor: 'pointer' }} />
          <label htmlFor="featured" style={{ color: 'var(--text)', fontSize: '0.875rem', cursor: 'pointer' }}>
            Mostra in evidenza nella home
          </label>
        </div>

        {/* Photos */}
        {section('Foto')}
        <div
          onClick={() => fileRef.current?.click()}
          style={{
            border: '2px dashed var(--warm-gray)', padding: '32px',
            textAlign: 'center', cursor: 'pointer', marginBottom: '16px',
            transition: 'border-color 0.2s, background 0.2s',
            backgroundColor: uploading ? 'var(--cream)' : 'white',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.backgroundColor = '#FFF5F5'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--warm-gray)'; e.currentTarget.style.backgroundColor = 'white'; }}
        >
          {uploading ? (
            <p style={{ color: 'var(--mid-gray)', fontSize: '0.875rem' }}>Caricamento in corso...</p>
          ) : (
            <>
              <p style={{ color: 'var(--mid-gray)', fontSize: '0.875rem', marginBottom: '4px' }}>Clicca per caricare le foto</p>
              <p style={{ color: 'var(--mid-gray)', fontSize: '0.72rem' }}>JPG, PNG · Max 10MB per foto · Puoi selezionare più foto</p>
            </>
          )}
        </div>
        <input ref={fileRef} type="file" multiple accept="image/*" style={{ display: 'none' }}
          onChange={e => e.target.files && handlePhotos(e.target.files)} />
        {form.photos.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {form.photos.map((url, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <img src={url} alt="" style={{ width: '80px', height: '60px', objectFit: 'cover' }} />
                <button type="button" onClick={() => update('photos', form.photos.filter((_, j) => j !== i))}
                  style={{ position: 'absolute', top: '-6px', right: '-6px', width: '18px', height: '18px', backgroundColor: 'var(--red)', border: 'none', color: 'white', borderRadius: '50%', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Description */}
        {section('Descrizione')}
        <div style={{ marginBottom: '8px' }}>
          <textarea value={form.description} onChange={e => update('description', e.target.value)}
            rows={5} placeholder="Descrizione del veicolo..."
            style={{ ...inp, resize: 'vertical' }}
            onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--warm-gray)'} />
        </div>
        <button type="button" onClick={handleGenerateDesc} disabled={generating}
          style={{
            backgroundColor: generating ? 'var(--warm-gray)' : 'var(--cream)',
            border: '1px solid var(--warm-gray)', color: generating ? 'var(--mid-gray)' : 'var(--text)',
            padding: '10px 20px', fontSize: '0.78rem', fontWeight: 500, cursor: generating ? 'not-allowed' : 'pointer',
            fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.06em', marginBottom: '24px',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
          {generating ? '⏳ Generazione AI...' : '✨ Genera con AI'}
        </button>

        {/* Features */}
        {section('Optional e Dotazioni')}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <input value={featureInput} onChange={e => setFeatureInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (featureInput.trim() && !form.features.includes(featureInput.trim())) { update('features', [...form.features, featureInput.trim()]); setFeatureInput(''); } } }}
            placeholder="Es. Navigatore · premi Invio per aggiungere"
            style={{ ...inp, flex: 1 }}
            onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--warm-gray)'} />
          <button type="button" onClick={() => { if (featureInput.trim()) { update('features', [...form.features, featureInput.trim()]); setFeatureInput(''); } }}
            style={{ backgroundColor: 'var(--black)', color: 'white', border: 'none', padding: '0 20px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem' }}>
            + Aggiungi
          </button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '32px' }}>
          {form.features.map(f => (
            <span key={f} style={{ backgroundColor: 'var(--cream)', border: '1px solid var(--warm-gray)', color: 'var(--text)', fontSize: '0.78rem', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {f}
              <button type="button" onClick={() => update('features', form.features.filter(i => i !== f))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mid-gray)', fontSize: '0.85rem', padding: 0, lineHeight: 1 }}>
                ✕
              </button>
            </span>
          ))}
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', gap: '10px', paddingTop: '24px', borderTop: '1px solid var(--warm-gray)' }}>
          <button type="button" onClick={() => navigate('/admin/auto')}
            style={{ padding: '13px 24px', border: '1px solid var(--warm-gray)', backgroundColor: 'white', color: 'var(--mid-gray)', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem' }}>
            Annulla
          </button>
          <button type="submit" disabled={loading}
            style={{ flex: 1, backgroundColor: loading ? 'var(--mid-gray)' : 'var(--red)', color: 'white', border: 'none', padding: '14px', fontSize: '0.82rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
            {loading ? 'Salvataggio...' : isEdit ? 'Aggiorna Veicolo' : 'Aggiungi Veicolo'}
          </button>
        </div>
      </form>
    </div>
  );
}