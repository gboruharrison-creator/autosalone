import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { createDealer } from '../../lib/db';
import toast from 'react-hot-toast';

export default function Register() {
  const [step, setStep] = useState<'account' | 'dealer'>('account');
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState({ email: '', password: '', confirmPassword: '' });
  const [dealerInfo, setDealerInfo] = useState({
    name: '', city: '', province: '', address: '',
    phone: '', whatsapp: '', email: '',
  });
  const { signup, refreshDealer } = useAuthStore();
  const navigate = useNavigate();

  const handleAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (account.password !== account.confirmPassword) {
      toast.error('Le password non coincidono');
      return;
    }
    if (account.password.length < 6) {
      toast.error('Password minimo 6 caratteri');
      return;
    }
    setStep('dealer');
  };

  const handleDealer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Create Firebase auth user
      const user = await signup(account.email, account.password);
      console.log('User created:', user.uid);

      // 2. Build slug
      const slug = dealerInfo.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '') + '-' + Date.now();

      // 3. Create dealer document
      const dealerData = {
        ownerId: user.uid,
        name: dealerInfo.name.trim(),
        slug,
        tagline: `Concessionaria auto a ${dealerInfo.city}`,
        address: dealerInfo.address.trim(),
        city: dealerInfo.city.trim(),
        province: dealerInfo.province.trim().toUpperCase(),
        phone: dealerInfo.phone.trim(),
        whatsapp: dealerInfo.whatsapp.trim() || dealerInfo.phone.replace(/\D/g, ''),
        email: dealerInfo.email.trim() || account.email,
        lat: 0,
        lng: 0,
        primaryColor: '#C8102E',
        plan: 'starter' as const,
        active: true,
      };

      console.log('Creating dealer:', dealerData);
      const dealerId = await createDealer(dealerData);
      console.log('Dealer created:', dealerId);

      // 4. Refresh dealer in store
      await refreshDealer();

      toast.success('Account creato! Benvenuto in AutoSalone.');
      navigate('/admin');
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.code === 'auth/email-already-in-use') {
        toast.error('Email già registrata. Prova ad accedere.');
      } else if (err.code === 'auth/weak-password') {
        toast.error('Password troppo debole. Minimo 6 caratteri.');
      } else if (err.message?.includes('permission')) {
        toast.error('Errore permessi Firebase. Controlla le regole Firestore.');
      } else {
        toast.error(`Errore: ${err.message || 'Riprovare'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: '100%', padding: '12px 16px',
    border: '1px solid var(--warm-gray)',
    backgroundColor: 'var(--cream)',
    color: 'var(--text)', fontSize: '0.875rem',
    outline: 'none', fontFamily: 'DM Sans, sans-serif',
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s',
  };

  const label = (text: string) => (
    <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: '8px' }}>
      {text}
    </label>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
            <div style={{ width: '28px', height: '28px', backgroundColor: 'var(--red)', clipPath: 'polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%)' }} />
            <span className="serif" style={{ color: 'white', fontSize: '1.1rem' }}>Auto<span style={{ color: 'var(--red)' }}>Salone</span></span>
          </Link>
          <h1 className="serif" style={{ color: 'white', fontSize: '1.8rem', fontWeight: 400, marginBottom: '8px' }}>
            {step === 'account' ? 'Crea Account' : 'La Tua Concessionaria'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', fontWeight: 300 }}>
            {step === 'account' ? 'Passo 1 di 2 — Credenziali di accesso' : 'Passo 2 di 2 — Dati concessionaria'}
          </p>
          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginTop: '16px' }}>
            {[0, 1].map(i => (
              <div key={i} style={{ width: '24px', height: '2px', backgroundColor: (step === 'account' ? i === 0 : true) ? 'var(--red)' : 'rgba(255,255,255,0.15)' }} />
            ))}
          </div>
        </div>

        {step === 'account' ? (
          <form onSubmit={handleAccount} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>{label('Email')}<input type="email" value={account.email} onChange={e => setAccount(a => ({ ...a, email: e.target.value }))} required placeholder="info@concessionaria.it" style={inp} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--warm-gray)'} /></div>
            <div>{label('Password')}<input type="password" value={account.password} onChange={e => setAccount(a => ({ ...a, password: e.target.value }))} required placeholder="Min. 6 caratteri" style={inp} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--warm-gray)'} /></div>
            <div>{label('Conferma Password')}<input type="password" value={account.confirmPassword} onChange={e => setAccount(a => ({ ...a, confirmPassword: e.target.value }))} required placeholder="Ripeti la password" style={inp} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--warm-gray)'} /></div>
            <button type="submit" style={{ backgroundColor: 'var(--red)', color: 'white', border: 'none', padding: '14px', fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', marginTop: '8px' }}>
              Continua →
            </button>
          </form>
        ) : (
          <form onSubmit={handleDealer} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>{label('Nome Concessionaria *')}<input value={dealerInfo.name} onChange={e => setDealerInfo(d => ({ ...d, name: e.target.value }))} required placeholder="Es. AutoRossi" style={inp} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--warm-gray)'} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
              <div>{label('Città *')}<input value={dealerInfo.city} onChange={e => setDealerInfo(d => ({ ...d, city: e.target.value }))} required placeholder="Campobasso" style={inp} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--warm-gray)'} /></div>
              <div>{label('Provincia *')}<input value={dealerInfo.province} onChange={e => setDealerInfo(d => ({ ...d, province: e.target.value }))} required placeholder="CB" maxLength={2} style={inp} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--warm-gray)'} /></div>
            </div>
            <div>{label('Indirizzo *')}<input value={dealerInfo.address} onChange={e => setDealerInfo(d => ({ ...d, address: e.target.value }))} required placeholder="Via Roma 47" style={inp} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--warm-gray)'} /></div>
            <div>{label('Telefono *')}<input value={dealerInfo.phone} onChange={e => setDealerInfo(d => ({ ...d, phone: e.target.value }))} required placeholder="+39 0874 123456" style={inp} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--warm-gray)'} /></div>
            <div>{label('WhatsApp (con prefisso, es. 393511234567)')}<input value={dealerInfo.whatsapp} onChange={e => setDealerInfo(d => ({ ...d, whatsapp: e.target.value }))} placeholder="393511234567" style={inp} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--warm-gray)'} /></div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button type="button" onClick={() => setStep('account')} style={{ flex: 1, backgroundColor: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.15)', padding: '13px', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                ← Indietro
              </button>
              <button type="submit" disabled={loading} style={{ flex: 2, backgroundColor: loading ? 'var(--mid-gray)' : 'var(--red)', color: 'white', border: 'none', padding: '14px', fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                {loading ? 'Registrazione...' : 'Crea Account'}
              </button>
            </div>
          </form>
        )}

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem' }}>
          Hai già un account?{' '}
          <Link to="/admin/login" style={{ color: 'white', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)' }}>
            Accedi
          </Link>
        </p>
      </div>
    </div>
  );
}