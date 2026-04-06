import { cars } from '../data/cars';
import { dealer } from '../data/dealer';

const carSummary = cars.map(c =>
  `[${c.condition === 'new' ? 'NUOVA' : 'USATA'}] ${c.brand} ${c.model} ${c.version} - ${c.year} - ${c.mileage === 0 ? '0km' : c.mileage.toLocaleString('it') + 'km'} - €${c.price.toLocaleString('it')} - ${c.fuel} - ${c.status === 'available' ? 'DISPONIBILE' : c.status === 'reserved' ? 'RISERVATA' : 'VENDUTA'}`
).join('\n');

const SYSTEM_PROMPT = `Sei l'assistente AI di ${dealer.name}, una concessionaria auto a ${dealer.city}.

INVENTARIO ATTUALE:
${carSummary}

IL TUO RUOLO:
- Aiuta i clienti a trovare l'auto giusta
- Rispondi in italiano, in modo professionale e amichevole
- Raccomanda auto specifiche in base alle esigenze del cliente
- Dai informazioni su prezzi, caratteristiche e disponibilità
- Per acquisti o test drive, invita a contattare la concessionaria via WhatsApp al ${dealer.whatsapp} o chiamando il ${dealer.phone}
- Risposte brevi e dirette — massimo 3 frasi

REGOLE:
- Parla solo delle auto nel nostro inventario
- Non inventare auto o prezzi non presenti nella lista
- Distingui sempre tra auto NUOVE e USATE
- Se chiedono di un'auto non disponibile, suggerisci alternative simili`;

export async function askDealerAI(messages: { role: string; content: string }[]): Promise<string> {
  const apiMessages = messages
    .filter((m, i) => !(i === 0 && m.role === 'assistant'))
    .map(m => ({ role: m.role, content: m.content }));

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: apiMessages,
    }),
  });

  if (!response.ok) throw new Error('AI request failed');
  const data = await response.json();
  return data.content[0].text;
}