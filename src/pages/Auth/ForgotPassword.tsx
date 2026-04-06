import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
      toast.success('Email inviata!');
    } catch {
      toast.error('Email non trovata');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
            <div style={{ width: '28px', height: '28px', backgroundColor: 'var(--red)', clipPath: 'polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%)' }} />
            <span className="serif" style={{ color: 'white', fontSize: '1.1rem' }}>Auto<span style={{ color: 'var(--red)' }}>Salone</span></span>
          </Link>
          <h1 className="serif" style={{ color: 'white', fontSize: '1.8rem', fontWeight: 400, marginBottom: '8px' }}>
            Password dimenticata
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', fontWeight: 300 }}>
            Inserisci la tua email per ricevere il link di reset
          </p>
        </div>

        {sent ? (
          <div style={{ backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', padding: '24px', textAlign: 'center' }}>
            <p style={{ color: '#4ADE80', fontSize: '0.875rem', marginBottom: '16px' }}>
              Email inviata a {email}. Controlla la tua casella di posta.
            </p>
            <Link to="/admin/login" style={{ color: 'white', fontSize: '0.82rem', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '1px' }}>
              Torna al login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Email
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="info@concessionaria.it"
                style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--warm-gray)', backgroundColor: 'var(--cream)', color: 'var(--text)', fontSize: '0.875rem', outline: 'none', fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box' as const, transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = 'var(--red)'}
                onBlur={e => e.target.style.borderColor = 'var(--warm-gray)'} />
            </div>
            <button type="submit" disabled={loading} style={{ backgroundColor: loading ? 'var(--mid-gray)' : 'var(--red)', color: 'white', border: 'none', padding: '14px', fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
              {loading ? 'Invio...' : 'Invia Link Reset'}
            </button>
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem' }}>
              <Link to="/admin/login" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>← Torna al login</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
