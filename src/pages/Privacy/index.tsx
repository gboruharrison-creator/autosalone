import { Helmet } from 'react-helmet-async';
import { dealer } from '../../data/dealer';

export default function Privacy() {
  return (
    <>
      <Helmet><title>Privacy Policy — {dealer.name}</title></Helmet>
      <div style={{ paddingTop: '68px', backgroundColor: 'var(--cream)', minHeight: '100vh' }}>
        <div style={{ backgroundColor: 'var(--black)', padding: '60px 2rem 40px' }}>
          <div style={{ maxWidth: '760px', margin: '0 auto' }}>
            <p style={{ color: 'var(--red)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>Documento legale</p>
            <h1 className="serif" style={{ color: 'white', fontSize: '2.4rem', fontWeight: 400 }}>Privacy Policy</h1>
          </div>
        </div>
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '60px 2rem' }}>
          {[
            { title: '1. Titolare del Trattamento', body: `${dealer.name}, ${dealer.address}, ${dealer.city} (${dealer.province}). Email: ${dealer.email}` },
            { title: '2. Dati Raccolti', body: 'Raccogliamo nome, telefono ed email quando compili il modulo di contatto. Non raccogliamo dati sensibili.' },
            { title: '3. Finalità del Trattamento', body: 'I dati sono utilizzati esclusivamente per rispondere alle richieste di informazioni sulle nostre auto e servizi.' },
            { title: '4. Base Giuridica', body: 'Il trattamento è basato sul consenso dell\'interessato (art. 6.1.a GDPR) e sull\'esecuzione di misure precontrattuali (art. 6.1.b GDPR).' },
            { title: '5. Conservazione', body: 'I dati vengono conservati per il tempo strettamente necessario a evadere la richiesta, e comunque non oltre 12 mesi.' },
            { title: '6. Diritti dell\'Interessato', body: 'Ai sensi del GDPR hai diritto di accesso, rettifica, cancellazione, limitazione e portabilità. Per esercitarli scrivi a: ' + dealer.email },
            { title: '7. Cookie', body: 'Il sito utilizza esclusivamente cookie tecnici essenziali al funzionamento. Non utilizziamo cookie di profilazione o pubblicitari.' },
          ].map(s => (
            <div key={s.title} style={{ marginBottom: '36px' }}>
              <h2 className="serif" style={{ color: 'var(--black)', fontSize: '1.15rem', fontWeight: 400, marginBottom: '10px' }}>{s.title}</h2>
              <p style={{ color: 'var(--mid-gray)', lineHeight: 1.9, fontSize: '0.9rem', fontWeight: 300 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}