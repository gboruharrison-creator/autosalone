import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
      toast.success('Benvenuto!');
    } catch (err: any) {
      toast.error('Credenziali non valide');
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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
            <div style={{ width: '28px', height: '28px', backgroundColor: 'var(--red)', clipPath: 'polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%)' }} />
            <span className="serif" style={{ color: 'white', fontSize: '1.1rem' }}>
              Auto<span style={{ color: 'var(--red)' }}>Salone</span>
            </span>
          </Link>
          <h1 className="serif" style={{ color: 'white', fontSize: '1.8rem', fontWeight: 400, marginBottom: '8px' }}>
            Area Dealer
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', fontWeight: 300 }}>
            Accedi al pannello di gestione
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Email
            </label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              required placeholder="info@tuaconcessionaria.it" style={inp}
              onFocus={e => e.target.style.borderColor = 'var(--red)'}
              onBlur={e => e.target.style.borderColor = 'var(--warm-gray)'} />
          </div>
          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Password
            </label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              required placeholder="••••••••" style={inp}
              onFocus={e => e.target.style.borderColor = 'var(--red)'}
              onBlur={e => e.target.style.borderColor = 'var(--warm-gray)'} />
          </div>
          <button type="submit" disabled={loading} style={{
            backgroundColor: loading ? 'var(--mid-gray)' : 'var(--red)',
            color: 'white', border: 'none', padding: '14px',
            fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.1em',
            textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'DM Sans, sans-serif', marginTop: '8px',
            transition: 'background 0.2s',
          }}>
            {loading ? 'Accesso...' : 'Accedi'}
          </button>
          <Link to="/admin/password-dimenticata" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textDecoration: 'none', marginTop: '8px', display: 'block', textAlign: 'right' }}>
            Password dimenticata?
          </Link>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem' }}>
          Non hai un account?{' '}
          <Link to="/admin/registrati" style={{ color: 'white', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)' }}>
            Registra la tua concessionaria
          </Link>
        </p>
      </div>
    </div>
  );
}