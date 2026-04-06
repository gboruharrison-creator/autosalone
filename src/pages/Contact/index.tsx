import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { dealer } from '../../data/dealer';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '', interest: 'generale' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Messaggio inviato. Ti contatteremo presto.');
    setForm({ name: '', phone: '', email: '', message: '', interest: 'generale' });
    setSending(false);
  };

  const field = (label: string, required = true) => ({
    style: {
      display: 'block' as const, color: 'var(--mid-gray)',
      fontSize: '0.65rem', fontWeight: 500 as const,
      letterSpacing: '0.12em', textTransform: 'uppercase' as const,
      marginBottom: '8px',
    },
    children: required ? label + ' *' : label,
  });

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    border: '1px solid var(--warm-gray)',
    backgroundColor: 'var(--cream)',
    color: 'var(--text)', fontSize: '0.875rem',
    outline: 'none', fontFamily: 'DM Sans, sans-serif',
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s',
  };

  return (
    <>
      <Helmet>
        <title>Contatti — {dealer.name} · {dealer.city}</title>
        <meta name="description" content={`Contatta ${dealer.name} a ${dealer.city}. Tel: ${dealer.phone}. Siamo aperti ${dealer.hours[0].days}.`} />
      </Helmet>

      <div style={{ paddingTop: '68px', backgroundColor: 'var(--cream)', minHeight: '100vh' }}>

        {/* Hero */}
        <div style={{ backgroundColor: 'var(--black)', padding: '80px 2rem 64px' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p style={{ color: 'var(--red)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '12px' }}>
                {dealer.address}, {dealer.city}
              </p>
              <h1 className="serif" style={{ color: 'white', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 400, lineHeight: 1.1, marginBottom: '16px' }}>
                Vieni a Trovarci
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem', fontWeight: 300, maxWidth: '480px', lineHeight: 1.75 }}>
                Siamo a {dealer.city} dal {dealer.founded}. Vieni in showroom, chiamaci o scrivici su WhatsApp — rispondiamo entro pochi minuti.
              </p>
            </motion.div>
          </div>
        </div>

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '2px', alignItems: 'start' }}>

            {/* Left — info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>

              {/* Contact items */}
              {[
                {
                  label: 'Telefono',
                  value: dealer.phone,
                  href: `tel:${dealer.phone}`,
                  cta: 'Chiama',
                },
                {
                  label: 'WhatsApp',
                  value: dealer.whatsapp.replace(/^39/, '+39 '),
                  href: `https://wa.me/${dealer.whatsapp}`,
                  cta: 'Scrivi ora',
                },
                {
                  label: 'Email',
                  value: dealer.email,
                  href: `mailto:${dealer.email}`,
                  cta: 'Invia',
                },
                {
                  label: 'Indirizzo',
                  value: `${dealer.address}, ${dealer.city} (${dealer.province})`,
                  href: dealer.googleMapsUrl,
                  cta: 'Indicazioni',
                },
              ].map((item, i) => (
                <motion.div key={item.label}
                  initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  style={{
                    backgroundColor: 'white', padding: '24px 28px',
                    border: '1px solid var(--warm-gray)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
                  }}>
                  <div>
                    <p style={{ color: 'var(--mid-gray)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {item.label}
                    </p>
                    <p style={{ color: 'var(--text)', fontWeight: 400, fontSize: '0.9rem' }}>
                      {item.value}
                    </p>
                  </div>
                  <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: 'var(--black)', color: 'white',
                      textDecoration: 'none', padding: '8px 18px',
                      fontSize: '0.72rem', fontWeight: 500,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      whiteSpace: 'nowrap', flexShrink: 0,
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--red)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--black)'}
                  >
                    {item.cta}
                  </a>
                </motion.div>
              ))}

              {/* Hours */}
              <div style={{ backgroundColor: 'white', padding: '28px', border: '1px solid var(--warm-gray)' }}>
                <p style={{ color: 'var(--mid-gray)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '20px' }}>
                  Orari di Apertura
                </p>
                {dealer.hours.map((h: { days: string; time: string }) => (
                  <div key={h.days} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 0', borderBottom: '1px solid var(--warm-gray)',
                  }}>
                    <span style={{ color: 'var(--mid-gray)', fontSize: '0.85rem', fontWeight: 300 }}>{h.days}</span>
                    <span style={{
                      color: h.time === 'Chiuso' ? 'var(--red)' : 'var(--text)',
                      fontSize: '0.85rem', fontWeight: h.time === 'Chiuso' ? 500 : 400,
                    }}>
                      {h.time}
                    </span>
                  </div>
                ))}
              </div>

              {/* Map */}
              <div style={{ overflow: 'hidden', border: '1px solid var(--warm-gray)', height: '220px' }}>
                <iframe
                  title="Posizione showroom"
                  src={`https://maps.google.com/maps?q=${dealer.lat},${dealer.lng}&z=15&output=embed`}
                  width="100%" height="100%"
                  style={{ border: 'none', display: 'block' }}
                  loading="lazy"
                />
              </div>
            </div>

            {/* Right — form */}
            <motion.div
              initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              style={{ backgroundColor: 'white', border: '1px solid var(--warm-gray)' }}
            >
              <div style={{ padding: '36px 36px 0', borderBottom: '1px solid var(--warm-gray)' }}>
                <p style={{ color: 'var(--mid-gray)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Modulo di Contatto
                </p>
                <h2 className="serif" style={{ color: 'var(--black)', fontSize: '1.6rem', fontWeight: 400, marginBottom: '28px', lineHeight: 1.2 }}>
                  Scrivici un Messaggio
                </h2>
              </div>

              <form onSubmit={handleSubmit} style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label {...field('Nome')}>Nome *</label>
                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
                      placeholder="Mario Rossi" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--black)'}
                      onBlur={e => e.target.style.borderColor = 'var(--warm-gray)'} />
                  </div>
                  <div>
                    <label {...field('Telefono')}>Telefono *</label>
                    <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required
                      placeholder="+39 000 000 0000" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--black)'}
                      onBlur={e => e.target.style.borderColor = 'var(--warm-gray)'} />
                  </div>
                </div>

                <div>
                  <label {...field('Email', false)}>Email</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="mario@email.com" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--black)'}
                    onBlur={e => e.target.style.borderColor = 'var(--warm-gray)'} />
                </div>

                <div>
                  <label style={{ display: 'block', color: 'var(--mid-gray)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Interesse
                  </label>
                  <select value={form.interest} onChange={e => setForm(f => ({ ...f, interest: e.target.value }))}
                    style={{ ...inputStyle, cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none' }}>
                    <option value="generale">Informazioni generali</option>
                    <option value="acquisto">Acquisto veicolo</option>
                    <option value="finanziamento">Finanziamento</option>
                    <option value="permuta">Permuta / Valutazione</option>
                    <option value="assistenza">Assistenza post-vendita</option>
                  </select>
                </div>

                <div>
                  <label {...field('Messaggio')}>Messaggio *</label>
                  <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required
                    rows={5} placeholder="Scrivi qui il tuo messaggio..."
                    style={{ ...inputStyle, resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = 'var(--black)'}
                    onBlur={e => e.target.style.borderColor = 'var(--warm-gray)'} />
                </div>

                <button type="submit" disabled={sending}
                  style={{
                    backgroundColor: sending ? 'var(--mid-gray)' : 'var(--black)',
                    color: 'white', border: 'none', padding: '15px',
                    fontSize: '0.78rem', fontWeight: 500, letterSpacing: '0.1em',
                    textTransform: 'uppercase', cursor: sending ? 'not-allowed' : 'pointer',
                    fontFamily: 'DM Sans, sans-serif', transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => { if (!sending) e.currentTarget.style.backgroundColor = 'var(--red)'; }}
                  onMouseLeave={e => { if (!sending) e.currentTarget.style.backgroundColor = 'var(--black)'; }}
                >
                  {sending ? 'Invio in corso...' : 'Invia Messaggio'}
                </button>

                <a href={`https://wa.me/${dealer.whatsapp}`} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    backgroundColor: '#25D366', color: 'white', textDecoration: 'none',
                    padding: '14px', fontSize: '0.78rem', fontWeight: 500,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1DAF57'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#25D366'}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Risposta immediata su WhatsApp
                </a>

                <p style={{ color: 'var(--mid-gray)', fontSize: '0.7rem', textAlign: 'center', lineHeight: 1.6, fontWeight: 300 }}>
                  I tuoi dati sono trattati ai sensi del GDPR · Regolamento UE 2016/679
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}