import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

export default function PerDealer() {
  const features = [
    { num: '01', title: 'Sito web professionale', desc: 'Il tuo catalogo auto online con foto, filtri, schede tecniche e prezzi. Indicizzato su Google dal primo giorno.' },
    { num: '02', title: 'Chatbot AI 24/7', desc: 'Un assistente AI risponde ai clienti in ogni momento — prezzi, disponibilità, finanziamento — anche di notte.' },
    { num: '03', title: 'Integrazione WhatsApp', desc: 'Ogni auto ha un bottone WhatsApp diretto. I lead arrivano sul tuo telefono in tempo reale.' },
    { num: '04', title: 'Gestione inventario', desc: 'Aggiungi, modifica e rimuovi auto dal tuo pannello admin. L\'AI genera le descrizioni in automatico.' },
    { num: '05', title: 'Dashboard lead', desc: 'Ogni richiesta di contatto viene salvata. Tieni traccia di ogni cliente dal primo contatto alla vendita.' },
    { num: '06', title: 'SEO locale incluso', desc: 'Ogni auto è una pagina Google. Appari nelle ricerche per "auto usate a [tua città]" senza pagare pubblicità.' },
  ];

  const pricing = [
    {
      name: 'Starter',
      setup: '€799',
      monthly: '€49/mese',
      desc: 'Per concessionarie piccole fino a 15 auto',
      features: ['Sito web professionale', 'Fino a 15 veicoli', 'Chatbot AI', 'WhatsApp su ogni auto', 'SEO locale', 'Supporto via email'],
      cta: 'Inizia con Starter',
      featured: false,
    },
    {
      name: 'Pro',
      setup: '€1.500',
      monthly: '€99/mese',
      desc: 'Per concessionarie in crescita fino a 50 auto',
      features: ['Tutto di Starter', 'Veicoli illimitati', 'Generatore descrizioni AI', 'Dashboard lead completa', 'Analisi visite per auto', 'Supporto prioritario WhatsApp'],
      cta: 'Inizia con Pro',
      featured: true,
    },
    {
      name: 'Complete',
      setup: '€3.000',
      monthly: '€199/mese',
      desc: 'Per concessionarie strutturate',
      features: ['Tutto di Pro', 'Design personalizzato', 'Export AutoScout24/Subito', 'CRM pipeline completo', 'Report mensile SEO', 'Account manager dedicato'],
      cta: 'Contattaci',
      featured: false,
    },
  ];

  return (
    <>
      <Helmet>
        <title>AutoSalone per Concessionarie — Digitalizza la tua concessionaria</title>
        <meta name="description" content="Il sito web professionale per la tua concessionaria auto. Chatbot AI, WhatsApp integrato, gestione inventario e SEO locale. Da €49/mese." />
      </Helmet>

      <div style={{ paddingTop: '68px', backgroundColor: 'var(--cream)' }}>

        {/* Hero */}
        <section style={{
          backgroundColor: 'var(--black)',
          padding: '100px 2rem 80px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '100%', backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(200,16,46,0.08) 0%, transparent 60%)' }} />
          <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p style={{ color: 'var(--red)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '20px' }}>
                Per le Concessionarie Auto
              </p>
              <h1 className="serif" style={{ color: 'white', fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 400, lineHeight: 1.08, marginBottom: '24px', letterSpacing: '-0.02em' }}>
                Il tuo showroom<br />
                <em style={{ color: 'var(--red)' }}>online</em> in 24 ore.
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', lineHeight: 1.8, maxWidth: '560px', marginBottom: '40px', fontWeight: 300 }}>
                Sito web professionale, chatbot AI, WhatsApp integrato e gestione inventario — tutto in un unico strumento pensato per le concessionarie italiane.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link to="/admin/registrati" style={{
                  backgroundColor: 'var(--red)', color: 'white', textDecoration: 'none',
                  padding: '14px 32px', fontSize: '0.875rem', fontWeight: 500,
                  letterSpacing: '0.04em', transition: 'background 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--red-dark)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--red)'}
                >
                  Registra la tua Concessionaria
                </Link>
                <a href="#prezzi" style={{
                  backgroundColor: 'transparent', color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none', padding: '14px 32px', fontSize: '0.875rem',
                  border: '1px solid rgba(255,255,255,0.15)', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                >
                  Vedi i prezzi
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section style={{ backgroundColor: 'white', borderBottom: '1px solid var(--warm-gray)' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1px', backgroundColor: 'var(--warm-gray)' }}>
            {[
              { num: '30.000+', label: 'Concessionarie in Italia' },
              { num: '24h', label: 'Tempo di attivazione' },
              { num: '€0', label: 'Costo setup iniziale*' },
              { num: '6x', label: 'Più lead rispetto a Subito' },
            ].map(s => (
              <div key={s.label} style={{ backgroundColor: 'white', padding: '28px 24px', textAlign: 'center' }}>
                <p className="serif" style={{ color: 'var(--black)', fontSize: '2rem', fontWeight: 400, lineHeight: 1, marginBottom: '6px' }}>{s.num}</p>
                <p style={{ color: 'var(--mid-gray)', fontSize: '0.72rem', fontWeight: 400 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section style={{ padding: '100px 2rem', backgroundColor: 'var(--cream)' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '60px' }}>
              <p style={{ color: 'var(--mid-gray)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>Cosa include</p>
              <h2 className="serif" style={{ color: 'var(--black)', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 400 }}>
                Tutto quello che ti serve.<br />Niente di superfluo.
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', backgroundColor: 'var(--warm-gray)' }}>
              {features.map((f, i) => (
                <motion.div key={f.num}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  style={{ backgroundColor: 'white', padding: '36px' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FFF5F5'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <p style={{ color: 'var(--red)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.12em', marginBottom: '12px' }}>{f.num}</p>
                  <h3 style={{ color: 'var(--black)', fontWeight: 500, fontSize: '0.95rem', marginBottom: '8px' }}>{f.title}</h3>
                  <p style={{ color: 'var(--mid-gray)', fontSize: '0.82rem', lineHeight: 1.7, fontWeight: 300 }}>{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section style={{ padding: '100px 2rem', backgroundColor: 'white' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '60px' }}>
              <p style={{ color: 'var(--mid-gray)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>Come funziona</p>
              <h2 className="serif" style={{ color: 'var(--black)', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 400 }}>
                Attivo in 24 ore.
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2px', backgroundColor: 'var(--warm-gray)' }}>
              {[
                { step: '1', title: 'Registrati', desc: 'Crea il tuo account gratuito in 2 minuti. Nessuna carta di credito richiesta.' },
                { step: '2', title: 'Configura', desc: 'Inserisci i dati della tua concessionaria e carica le tue auto con foto e prezzi.' },
                { step: '3', title: 'Pubblica', desc: 'Il tuo sito è online. Condividilo sui social e su Google My Business.' },
                { step: '4', title: 'Ricevi lead', desc: 'I clienti ti contattano via WhatsApp e form. Tu rispondi e vendi.' },
              ].map(s => (
                <div key={s.step} style={{ backgroundColor: 'white', padding: '36px' }}>
                  <p className="serif" style={{ color: 'var(--red)', fontSize: '2.5rem', fontWeight: 400, lineHeight: 1, marginBottom: '16px' }}>{s.step}</p>
                  <h3 style={{ color: 'var(--black)', fontWeight: 500, fontSize: '0.95rem', marginBottom: '8px' }}>{s.title}</h3>
                  <p style={{ color: 'var(--mid-gray)', fontSize: '0.82rem', lineHeight: 1.7, fontWeight: 300 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="prezzi" style={{ padding: '100px 2rem', backgroundColor: 'var(--cream)' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '60px' }}>
              <p style={{ color: 'var(--mid-gray)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>Prezzi</p>
              <h2 className="serif" style={{ color: 'var(--black)', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 400 }}>
                Trasparenti. Senza sorprese.
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2px', backgroundColor: 'var(--warm-gray)' }}>
              {pricing.map(plan => (
                <div key={plan.name} style={{
                  backgroundColor: plan.featured ? 'var(--black)' : 'white',
                  padding: '40px', display: 'flex', flexDirection: 'column',
                  position: 'relative',
                }}>
                  {plan.featured && (
                    <div style={{ position: 'absolute', top: '-1px', left: '40px', backgroundColor: 'var(--red)', color: 'white', fontSize: '0.6rem', fontWeight: 600, padding: '4px 12px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      Più scelto
                    </div>
                  )}
                  <p style={{ color: plan.featured ? 'var(--red)' : 'var(--mid-gray)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
                    {plan.name}
                  </p>
                  <p className="serif" style={{ color: plan.featured ? 'white' : 'var(--black)', fontSize: '2.2rem', fontWeight: 400, lineHeight: 1, marginBottom: '4px' }}>
                    {plan.monthly}
                  </p>
                  <p style={{ color: plan.featured ? 'rgba(255,255,255,0.4)' : 'var(--mid-gray)', fontSize: '0.78rem', marginBottom: '6px', fontWeight: 300 }}>
                    + {plan.setup} una tantum
                  </p>
                  <p style={{ color: plan.featured ? 'rgba(255,255,255,0.5)' : 'var(--mid-gray)', fontSize: '0.78rem', marginBottom: '28px', fontWeight: 300, lineHeight: 1.6 }}>
                    {plan.desc}
                  </p>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
                    {plan.features.map(f => (
                      <div key={f} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <div style={{ width: '4px', height: '4px', backgroundColor: 'var(--red)', flexShrink: 0, marginTop: '6px' }} />
                        <span style={{ color: plan.featured ? 'rgba(255,255,255,0.65)' : 'var(--mid-gray)', fontSize: '0.82rem', fontWeight: 300 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <Link to="/admin/registrati" style={{
                    display: 'block', textAlign: 'center',
                    backgroundColor: plan.featured ? 'var(--red)' : 'var(--black)',
                    color: 'white', textDecoration: 'none',
                    padding: '13px', fontSize: '0.78rem', fontWeight: 500,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
            <p style={{ color: 'var(--mid-gray)', fontSize: '0.72rem', marginTop: '16px', textAlign: 'center', fontWeight: 300 }}>
              * Setup gratuito per i primi 10 dealer che si registrano nel mese di lancio.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section style={{ backgroundColor: 'var(--red)', padding: '80px 2rem', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ maxWidth: '560px', margin: '0 auto' }}>
            <h2 className="serif" style={{ color: 'white', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 400, marginBottom: '16px', lineHeight: 1.1 }}>
              Inizia oggi.<br />Il primo mese è gratuito.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', marginBottom: '32px', lineHeight: 1.75, fontWeight: 300 }}>
              Nessuna carta di credito. Nessun contratto vincolante. Cancelli quando vuoi.
            </p>
            <Link to="/admin/registrati" style={{
              display: 'inline-block',
              backgroundColor: 'white', color: 'var(--red)',
              textDecoration: 'none', padding: '15px 36px',
              fontSize: '0.875rem', fontWeight: 600,
              letterSpacing: '0.04em', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--black)'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = 'var(--red)'; }}
            >
              Registra la tua Concessionaria
            </Link>
          </motion.div>
        </section>
      </div>
    </>
  );
}