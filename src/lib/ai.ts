export async function generateCarDescription(car: {
  brand: string; model: string; version: string;
  year: number; mileage: number; fuel: string;
  gearbox: string; colour: string; power: number;
  condition: string; features: string[];
}): Promise<string> {
  const prompt = `Sei un esperto copywriter per concessionarie auto italiane.
Scrivi una descrizione professionale e persuasiva in italiano per questa auto.
La descrizione deve essere di 3-4 frasi, evidenziare i punti di forza, essere naturale e non sembrare generata da AI.

AUTO:
${car.condition === 'new' ? 'NUOVA' : 'USATA'} - ${car.brand} ${car.model} ${car.version}
Anno: ${car.year}
${car.condition === 'used' ? `Chilometri: ${car.mileage.toLocaleString('it')} km` : '0 km - Prima immatricolazione'}
Carburante: ${car.fuel}
Cambio: ${car.gearbox}
Colore: ${car.colour}
Potenza: ${car.power} cv
Optional: ${car.features.slice(0, 6).join(', ')}

Scrivi solo la descrizione, nient'altro. Tono professionale ma caldo.`;

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
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) throw new Error('AI generation failed');
  const data = await response.json();
  return data.content[0].text;
}