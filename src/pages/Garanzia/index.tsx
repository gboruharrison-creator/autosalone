import { Helmet } from 'react-helmet-async';
import { dealer } from '../../data/dealer';

export default function Garanzia() {
  return (
    <>
      <Helmet><title>Garanzia Legale — {dealer.name}</title></Helmet>
      <div style={{ paddingTop: '68px', backgroundColor: 'var(--cream)', minHeight: '100vh' }}>
        <div style={{ backgroundColor: 'var(--black)', padding: '60px 2rem 40px' }}>
          <div style={{ maxWidth: '760px', margin: '0 auto' }}>
            <p style={{ color: 'var(--red)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>Tutela del consumatore</p>
            <h1 className="serif" style={{ color: 'white', fontSize: '2.4rem', fontWeight: 400 }}>Garanzia Legale</h1>
          </div>
        </div>
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '60px 2rem' }}>
          {[
            { title: 'Garanzia Legale di Conformità', body: 'Tutti i veicoli venduti da ' + dealer.name + ' sono coperti dalla Garanzia Legale di Conformità prevista dal Codice del Consumo (D.Lgs. 206/2005, artt. 128-135).' },
            { title: 'Durata', body: 'La garanzia legale ha durata di 24 mesi per i veicoli nuovi. Per i veicoli usati la durata può essere ridotta a 12 mesi, come concordato per iscritto al momento della vendita.' },
            { title: 'Cosa Copre', body: 'La garanzia copre i difetti di conformità esistenti al momento della consegna del veicolo. Non copre i danni derivanti da uso improprio, incidenti o normale usura.' },
            { title: 'Come Esercitarla', body: 'In caso di difetto, contattaci entro 2 mesi dalla scoperta. Provvederemo gratuitamente alla riparazione o sostituzione del veicolo. Contatto: ' + dealer.phone },
            { title: 'Garanzia Commerciale', body: 'In aggiunta alla garanzia legale, offriamo su richiesta estensioni di garanzia commerciale. Chiedi informazioni al momento dell\'acquisto.' },
          ].map(s => (
            <div key={s.title} style={{ marginBottom: '36px', paddingBottom: '36px', borderBottom: '1px solid var(--warm-gray)' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '3px', height: '100%', minHeight: '24px', backgroundColor: 'var(--red)', flexShrink: 0, marginTop: '4px' }} />
                <div>
                  <h2 className="serif" style={{ color: 'var(--black)', fontSize: '1.15rem', fontWeight: 400, marginBottom: '10px' }}>{s.title}</h2>
                  <p style={{ color: 'var(--mid-gray)', lineHeight: 1.9, fontSize: '0.9rem', fontWeight: 300 }}>{s.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}